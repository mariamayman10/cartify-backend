import { Document } from "mongoose";

export interface Coupon extends Document{
    code: string;
    expireDate: Date;
    discount: number;
}