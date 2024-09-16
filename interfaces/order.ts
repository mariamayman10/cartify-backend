import { Document } from "mongoose";
import { CartProduct } from "./cart";
import { Address, User } from "./user";

export interface Order extends Document{
    cartItems: CartProduct;
    user: User;
    totalPrice: number;
    taxPrice: number;
    isDelivered: boolean;
    DeliveredDate: Date;
    isPaid: boolean;
    PaidDate: Date;
    payment: 'Cash' | 'Card';
    address: Address;
}