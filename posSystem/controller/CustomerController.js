import {CustomerModel} from "../model/CustomerModel.js";
import {customer_db} from "../db/db.js";

$(document).ready(function () {
    // Initialize disabled buttons
    $("#update-customer, #clear-customer").attr("disabled", "true");

    // Populate customer dropdown on load
    populateCustomerDropdown();

    // Save customer
    $("#save-customer").on("click", function () {
        let id = $("#customer-id").val();
        let name = $("#customer-name").val();
        let address = $("#customer-address").val();
        let phone = $("#customer-phone").val();

        if (id === "" || name === "" || address === "" || phone === "") {
            Swal.fire({
                title: "Error!",
                text: "Invalid Inputs",
                icon: "error",
                confirmButtonText: "Ok",
            });
        } else {
            let customer = new CustomerModel(id, name, address, phone);
            customer_db.push(customer);
            Swal.fire({
                title: "Added Successfully!",
                icon: "success",
                draggable: true,
            });
            loadCustomers();
            populateCustomerDropdown();
        }

        $("#customer-id").val("");
        $("#customer-name").val("");
        $("#customer-address").val("");
        $("#customer-phone").val("");
    });

    // Update customer
    $("#update-customer").on("click", function () {
        let id = $("#customer-id").val();
        let name = $("#customer-name").val();
        let address = $("#customer-address").val();
        let phone = $("#customer-phone").val();

        if (id === "" || name === "" || address === "" || phone === "") {
            Swal.fire({
                title: "Error!",
                text: "Invalid Inputs",
                icon: "error",
                confirmButtonText: "Ok",
            });
        } else {
            let index = customer_db.findIndex(customer => customer.id === id);
            if (index !== -1) {
                customer_db[index] = new CustomerModel(id, name, address, phone);
                Swal.fire({
                    title: "Updated Successfully!",
                    icon: "success",
                    draggable: true,
                });
                loadCustomers();
                populateCustomerDropdown();
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Customer not found",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
        }

        $("#customer-id").val("");
        $("#customer-name").val("");
        $("#customer-address").val("");
        $("#customer-phone").val("");
        $("#update-customer").attr("disabled", "true");
        $("#clear-customer").attr("disabled", "true");
    });

    // Clear (delete) customer
    $("#clear-customer").on("click", function () {
        let id = $("#customer-id").val();
        deleteCustomer(id);
    });

    // Handle table row click for editing
    $("#customer-table").on('click', 'tr', function () {
        let idx = $(this).index();
        editCustomer(idx);
    });
});

// Load customers into table
function loadCustomers() {
    $("#customer-table").empty();
    customer_db.forEach((item, index) => {
        let row = `<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.address}</td>
            <td>${item.phone}</td>
            <td>
                <button class="action-btn delete-btn" onclick="deleteCustomer('${item.id}')">Delete</button>
            </td>
        </tr>`;
        $("#customer-table").append(row);
    });
}

// Edit customer
function editCustomer(index) {
    let obj = customer_db[index];
    $("#customer-id").val(obj.id);
    $("#customer-name").val(obj.name);
    $("#customer-address").val(obj.address);
    $("#customer-phone").val(obj.phone);
    $("#update-customer").removeAttr("disabled");
    $("#clear-customer").removeAttr("disabled");
}

// Delete customer
function deleteCustomer(id) {
    let index = customer_db.findIndex(customer => customer.id === id);
    if (index !== -1) {
        customer_db.splice(index, 1);
        Swal.fire({
            title: "Deleted Successfully!",
            icon: "success",
            draggable: true,
        });
        loadCustomers();
        populateCustomerDropdown();
    } else {
        Swal.fire({
            title: "Error!",
            text: "Customer not found",
            icon: "error",
            confirmButtonText: "Ok",
        });
    }
    $("#customer-id").val("");
    $("#customer-name").val("");
    $("#customer-address").val("");
    $("#customer-phone").val("");
    $("#update-customer").attr("disabled", "true");
    $("#clear-customer").attr("disabled", "true");
}

// Populate customer dropdown
export function populateCustomerDropdown() {
    $("#order-customer-id").empty();
    $("#order-customer-id").append('<option value="">Select Customer</option>');
    customer_db.forEach(customer => {
        $("#order-customer-id").append(`<option value="${customer.id}">${customer.id} - ${customer.name}</option>`);
    });
}