import { Document } from "mongoose";
import { User } from "./user";
import Product from "./product";

export interface Review extends Document{
    user: User;
    product: Product;
    comment: string;
    rate: number;
}