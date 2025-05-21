import { ItemModel } from "../model/itemModel.js";
import { item_db } from "../db/db.js";


$(document).ready(function () {
    // Initialize disabled buttons
    $("#update-item, #clear-item").attr("disabled", "true");

    // Populate item dropdown on load
    populateItemDropdown();

    // Save item
    $("#save-item").on("click", function () {
        let id = $("#item-id").val();
        let name = $("#item-name").val();
        let price = $("#item-price").val();
        let quantity = $("#item-quantity").val();

        if (id === "" || name === "" || price === "" || quantity === "") {
            Swal.fire({
                title: "Error!",
                text: "Invalid Inputs",
                icon: "error",
                confirmButtonText: "Ok",
            });
        } else {
            let item = new ItemModel(id, name, price, quantity);
            item_db.push(item);
            Swal.fire({
                title: "Added Successfully!",
                icon: "success",
                draggable: true,
            });
            loadItems();
            populateItemDropdown();
        }

        $("#item-id").val("");
        $("#item-name").val("");
        $("#item-price").val("");
        $("#item-quantity").val("");
    });

    // Update item
    $("#update-item").on("click", function () {
        let id = $("#item-id").val();
        let name = $("#item-name").val();
        let price = $("#item-price").val();
        let quantity = $("#item-quantity").val();

        if (id === "" || name === "" || price === "" || quantity === "") {
            Swal.fire({
                title: "Error!",
                text: "Invalid Inputs",
                icon: "error",
                confirmButtonText: "Ok",
            });
        } else {
            let index = item_db.findIndex(item => item.id === id);
            if (index !== -1) {
                item_db[index] = new ItemModel(id, name, price, quantity);
                Swal.fire({
                    title: "Updated Successfully!",
                    icon: "success",
                    draggable: true,
                });
                loadItems();
                populateItemDropdown();
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Item not found",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
        }

        $("#item-id").val("");
        $("#item-name").val("");
        $("#item-price").val("");
        $("#item-quantity").val("");
        $("#update-item").attr("disabled", "true");
        $("#clear-item").attr("disabled", "true");
    });

    // Clear (delete) item
    $("#clear-item").on("click", function () {
        let id = $("#item-id").val();
        deleteItem(id);
    });

    // Handle table row click for editing
    $("#item-table").on('click', 'tr', function () {
        let idx = $(this).index();
        editItem(idx);
    });
});

// Load items into table
function loadItems() {
    $("#item-table").empty();
    item_db.forEach((item, index) => {
        let row = `<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
           
        </tr>`;
        $("#item-table").append(row);
    });
}

// Edit item
function editItem(index) {
    let obj = item_db[index];
    $("#item-id").val(obj.id);
    $("#item-name").val(obj.name);
    $("#item-price").val(obj.price);
    $("#item-quantity").val(obj.quantity);
    $("#update-item").removeAttr("disabled");
    $("#clear-item").removeAttr("disabled");
}

// Delete item
function deleteItem(id) {
    let index = item_db.findIndex(item => item.id === id);
    if (index !== -1) {
        item_db.splice(index, 1);
        Swal.fire({
            title: "Deleted Successfully!",
            icon: "success",
            draggable: true,
        });
        loadItems();
        populateItemDropdown();
    } else {
        Swal.fire({
            title: "Error!",
            text: "Item not found",
            icon: "error",
            confirmButtonText: "Ok",
        });
    }
    $("#item-id").val("");
    $("#item-name").val("");
    $("#item-price").val("");
    $("#item-quantity").val("");
    $("#update-item").attr("disabled", "true");
    $("#clear-item").attr("disabled", "true");
}

// Populate item dropdown
export function populateItemDropdown() {
    $("#order-item-id").empty();
    $("#order-item-id").append('<option value="">Select Item</option>');
    item_db.forEach(item => {
        $("#order-item-id").append(`<option value="${item.id}">${item.id} - ${item.name}</option>`);
    });
}