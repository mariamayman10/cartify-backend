import { model, Schema } from "mongoose";
import { Coupon } from "../interfaces/coupon";


const CouponSchema: Schema = new Schema<Coupon>({
    code: {type:String, required: true, unique: true},
    expireDate: {type:Date, required: true},
    discount: {type: Number, required: true},
}, {timestamps: true});

const CouponModel = model<Coupon>('Coupon', CouponSchema);

export default CouponModel;