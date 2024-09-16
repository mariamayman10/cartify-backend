import { Schema, model } from "mongoose";
import { Cart } from "../interfaces/cart";


const CartSchema: Schema = new Schema<Cart>({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cartItems: [{
        product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
        quantity: {type: Number, default: 1},
        price: {type: Number},
    }],
    totalPrice: {type: Number},
    totalPriceAfterDiscount: {type: Number}
}, {timestamps: true});

CartSchema.pre<Cart>(/^find/, function(next){
    this.populate({path: 'cartItems.product', select: 'name cover'});
    next();
});

const CartModel = model<Cart>('Cart', CartSchema);

export default CartModel;
