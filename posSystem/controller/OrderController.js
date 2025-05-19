import { order_db } from "../db/db.js";
import { cart } from "../db/db.js";
import { customer_db } from "../db/db.js";
import { item_db } from "../db/db.js";
import { orderDetails_db } from "../db/db.js";
import { OrderDetailsModel } from "../model/OrderDetailsModel.js";
import { OrderModel } from "../model/OrderModel.js";




$(document).ready(function () {
    // Initialize disabled buttons
    $("#update-order, #delete-order").attr("disabled", "true");

    // Auto-populate customer name
    $("#order-customer-id").on("change", function () {
        let customerId = $(this).val();
        let customer = customer_db.find(c => c.id === customerId);
        $("#order-customer-name").val(customer ? customer.name : "");
    });

    // Auto-populate item details
    $("#order-item-id").on("change", function () {
        let itemId = $(this).val();
        let item = item_db.find(i => i.id === itemId);
        if (item) {
            $("#order-item-description").val(item.name);
            $("#order-item-unit-price").val(item.price);
            $("#order-item-available-qty").val(item.quantity);
            $("#order-item-qty").val("");
        } else {
            $("#order-item-description").val("");
            $("#order-item-unit-price").val("");
            $("#order-item-available-qty").val("");
            $("#order-item-qty").val("");
        }
    });

    // Add to cart
    $("#add-to-cart").on("click", function () {
        let itemId = $("#order-item-id").val();
        let description = $("#order-item-description").val();
        let unitPrice = parseFloat($("#order-item-unit-price").val());
        let availableQty = parseInt($("#order-item-available-qty").val());
        let qty = parseInt($("#order-item-qty").val());

        if (!itemId || !description || isNaN(unitPrice) || isNaN(qty) || qty <= 0 || qty > availableQty) {
            Swal.fire({
                title: "Error!",
                text: "Please select an item and enter a valid quantity (1 to available quantity).",
                icon: "error",
                confirmButtonText: "Ok",
            });
            return;
        }

        // Add to cart
        cart.push({ itemId, description, unitPrice, qty, total: unitPrice * qty });
        updateOrderSummaryTable();
        updateOrderTotal();

        // Clear item fields
        $("#order-item-id").val("");
        $("#order-item-description").val("");
        $("#order-item-unit-price").val("");
        $("#order-item-available-qty").val("");
        $("#order-item-qty").val("");
    });

    // Save order
    $("#save-order").on("click", function () {
        let id = $("#order-id").val();
        let customerId = $("#order-customer-id").val();
        let date = $("#order-date").val();
        let total = parseFloat($("#order-total").val());

        if (id === "" || customerId === "" || date === "" || isNaN(total) || cart.length === 0) {
            Swal.fire({
                title: "Error!",
                text: "Please fill all fields and add items to the cart.",
                icon: "error",
                confirmButtonText: "Ok",
            });
            return;
        }

        // Save order
        let order = new OrderModel(id, customerId, date, total);
        order_db.push(order);

        // Save order history
        cart.forEach(item => {
            let orderHistory = new OrderDetailsModel(id, item.itemId, item.qty, item.unitPrice);
            orderDetails_db.push(orderHistory);
        });

        Swal.fire({
            title: "Order Saved Successfully!",
            icon: "success",
            draggable: true,
        });

        // Clear form and cart
        clearOrderForm();
        cart.length = 0;
        updateOrderSummaryTable();
        loadOrders();
    });

    // Update order
    $("#update-order").on("click", function () {
        let id = $("#order-id").val();
        let customerId = $("#order-customer-id").val();
        let date = $("#order-date").val();
        let total = parseFloat($("#order-total").val());

        if (id === "" || customerId === "" || date === "" || isNaN(total) || cart.length === 0) {
            Swal.fire({
                title: "Error!",
                text: "Please fill all fields and add items to the cart.",
                icon: "error",
                confirmButtonText: "Ok",
            });
            return;
        }

        // Update order
        let index = order_db.findIndex(order => order.id === id);
        if (index !== -1) {
            order_db[index] = new OrderModel(id, customerId, date, total);

            // Remove old order history
            orderDetails_db = orderDetails_db.filter(details => details.orderId !== id);

            // Add new order history
            cart.forEach(item => {
                let orderHistory = new OrderDetailsModel(id, item.itemId, item.qty, item.unitPrice);
                orderDetails_db.push(orderHistory);
            });

            Swal.fire({
                title: "Updated Successfully!",
                icon: "success",
                draggable: true,
            });

            loadOrders();
        } else {
            Swal.fire({
                title: "Error!",
                text: "Order not found",
                icon: "error",
                confirmButtonText: "Ok",
            });
        }

        // Clear form and cart
        clearOrderForm();
        cart.length = 0;        
        updateOrderSummaryTable();
        $("#update-order").attr("disabled", "true");
        $("#delete-order").attr("disabled", "true");
    });

    // Delete order
    $("#delete-order").on("click", function () {
        let id = $("#order-id").val();

        let index = order_db.findIndex(order => order.id === id);
        if (index !== -1) {
            order_db.splice(index, 1);
            orderDetails_db = orderDetails_db.filter(details => details.orderId !== id);
            Swal.fire({
                title: "Deleted Successfully!",
                icon: "success",
                draggable: true,
            });

            loadOrders();
        } else {
            Swal.fire({
                title: "Error!",
                text: "Order not found",
                icon: "error",
                confirmButtonText: "Ok",
            });
        }

        // Clear form and cart
        clearOrderForm();
        cart.length = 0;
        updateOrderSummaryTable();
        $("#update-order").attr("disabled", "true");
        $("#delete-order").attr("disabled", "true");
    });

    // Handle table row click for editing
    $("#order-table").on('click', 'tr', function () {
        let idx = $(this).index();
        let obj = order_db[idx];

        $("#order-id").val(obj.id);
        $("#order-customer-id").val(obj.customerId);
        $("#order-customer-name").val(customer_db.find(c => c.id === obj.customerId)?.name || "");
        $("#order-date").val(obj.date);
        $("#order-total").val(obj.total);

        // Load cart from orderHistory_db
        cart = orderDetails_db
            .filter(details => details.orderId === obj.id)
            .map(details => ({
                itemId: details.itemId,
                description: item_db.find(i => i.id === details.itemId)?.name || "",
                unitPrice: details.unitPrice,
                qty: details.quantity,
                total: details.quantity * details.unitPrice
            }));
        updateOrderSummaryTable();

        $("#update-order").removeAttr("disabled");
        $("#delete-order").removeAttr("disabled");
    });
});

// Update order summary table
function updateOrderSummaryTable() {
    $("#order-summary-table").empty();
    cart.forEach(item => {
        let row = `<tr>
            <td>${item.itemId}</td>
            <td>${item.description}</td>
            <td>${item.unitPrice.toFixed(2)}</td>
            <td>${item.qty}</td>
            <td>${item.total.toFixed(2)}</td>
        </tr>`;
        $("#order-summary-table").append(row);
    });
}

// Update order total
function updateOrderTotal() {
    let total = cart.reduce((sum, item) => sum + item.total, 0);
    $("#order-total").val(total.toFixed(2));
}

// Clear order form
function clearOrderForm() {
    $("#order-id").val("");
    $("#order-customer-id").val("");
    $("#order-customer-name").val("");
    $("#order-date").val("");
    $("#order-total").val("");
}

// Load orders into table
export function loadOrders() {
    $("#order-table").empty();
    order_db.forEach((order, index) => {
        let row = `<tr>
            <td>${order.id}</td>
            <td>${order.customerId}</td>
            <td>${order.date}</td>
            <td>${order.total}</td>
        </tr>`;
        $("#order-table").append(row);
    });
}