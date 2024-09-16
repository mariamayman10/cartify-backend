import { Document } from "mongoose";
import Product from "./product";
import { User } from "./user";

export interface Cart extends Document{
    user: User;
    cartItems: CartProduct[];
    totalPrice: number;
    totalPriceAfterDiscount: number | undefined;
}

export interface CartProduct extends Document{
    product: Product;
    quantity: number;
    price: number;
}