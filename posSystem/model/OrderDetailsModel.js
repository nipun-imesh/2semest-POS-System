

export class OrderDetailsModel {
    constructor(orderId, itemId, quantity, unitPrice) {
        this.orderId = orderId;
        this.itemId = itemId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }
}