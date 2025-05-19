import { orderDetails_db } from "../db/db.js";
import { OrderDetailsModel } from "../model/OrderDetailsModel.js";
import { item_db, order_db } from "../db/db.js";



$(document).ready(function () {
    console.log("Order Details DB:", orderDetails_db);

    loadOrderHistory();
});


 export function loadOrderHistory() {
    $("#order-details-table").empty();
    orderDetails_db.forEach(details => {
        let item = item_db.find(i => i.id === details.itemId);
        let total = details.quantity * details.unitPrice;
        let row = `<tr>
            <td>${details.orderId}</td>
            <td>${order_db.find(o => o.id === details.orderId)?.customerId || ""}</td>
            <td>${details.itemId}</td>
            <td>${item ? item.name : ""}</td>
            <td>${details.quantity}</td>
            <td>${total.toFixed(2)}</td>
        </tr>`;
        $("#order-details-table").append(row);
    });
}