import { Coupon } from "../interfaces/coupon";
import CouponModel from "../schemas/couponSchema";
import { createDocument, deleteDocument, getDocument, getDocuments, updateDocument } from "./controllerInterface";
import asyncHandler from 'express-async-handler';
import { Request, Response ,NextFunction } from 'express';
import UserModel from "../schemas/userSchema";
import ApiErrors from "../utils/apiErrors";
import { sendMail } from "../utils/sendMail";


export const createCoupon = createDocument<Coupon>(CouponModel);
export const updateCoupon = updateDocument<Coupon>(CouponModel);
export const deleteCoupon = deleteDocument<Coupon>(CouponModel);
export const sendCoupon = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {  
    const email = req.body.email;
    const coupon: any = await CouponModel.findById(req.params.id);
    if(!coupon) return next(new ApiErrors('Invalid coupon id', 400));
    const emailMessage = `Congratulations! \n Now you can use the code ${coupon.code} to get ${coupon.discount}% off`;
    try{
        await sendMail({email: email, subject: 'Coupon Gift', message: emailMessage});
    }catch(err) {
        console.log(err);
        return next(new ApiErrors('Failed to send email', 400));
    }
    res.status(200).json();
});
export const getCoupon = getDocument<Coupon>(CouponModel);
export const getCoupons = getDocuments<Coupon>(CouponModel, 'Coupon');