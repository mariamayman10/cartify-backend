import { model, Schema } from "mongoose";
import { Order } from "../interfaces/order";


const OrderSchema: Schema = new Schema<Order>({
    cartItems: [{
        product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
        quantity: {type: Number, default: 1},
        price: {type: Number},
    }],
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    totalPrice: {type: Number},
    taxPrice: {type: Number},
    isDelivered: {type: Boolean, default: false},
    DeliveredDate: {type: Date},
    isPaid: {type: Boolean, default: false},
    PaidDate: {type: Date},
    payment: {type: String, default: 'Cash'},
    address: {
        street: {type: String, required: true, trim: true},
        city: {type: String, required: true, trim: true},
        state: {type: String, required: true, trim: true},
        apartmentNo: {type: String, required: true, trim: true},
    }
}, {timestamps: true});

OrderSchema.pre<Order>(/^find/, function (next) {
    this.populate({ path: 'cartItems.product', select: 'name cover' })
    this.populate({ path: 'user', select: 'name image email' })
    next()
});

const OrderModel = model<Order>('Order', OrderSchema);

export default OrderModel;