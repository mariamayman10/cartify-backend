import { Router } from "express";
import { allowedTo, applyProtection, checkActive } from "../controllers/authenticationController";
import { createCoupon, deleteCoupon, getCoupon, getCoupons, sendCoupon, updateCoupon } from "../controllers/couponController";
import { createCouponValidator, deleteCouponValidator, getCouponValidator, sendCouponValidator, updateCouponValidator } from "../utils/validation/couponValidator";


const CouponRoutes: Router = Router();
CouponRoutes.use(applyProtection, checkActive, allowedTo('manager', 'admin'));
CouponRoutes.route('/:id/send')
    .post(sendCouponValidator, sendCoupon)
CouponRoutes.route('/')
    .get(getCoupons)
    .post(createCouponValidator, createCoupon);
CouponRoutes.route('/:id')
    .get(getCouponValidator, getCoupon)
    .delete(deleteCouponValidator, deleteCoupon)
    .put(updateCouponValidator, updateCoupon)

export default CouponRoutes;