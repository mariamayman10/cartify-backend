import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import { RequestHandler } from "express";
import CouponModel from "./../../schemas/couponSchema";
import UserModel from "../../schemas/userSchema";

export const getCouponValidator: RequestHandler[] = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];

export const sendCouponValidator: RequestHandler[] = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (val) => {
      const user = await UserModel.findOne({ email: val });
      if (!user) {
        throw new Error("No user with such an email");
      }
    }),
  validatorMiddleware,
];

export const createCouponValidator: RequestHandler[] = [
  check("code")
    .notEmpty()
    .withMessage("Coupon code is required")
    .isLength({ min: 5, max: 10 })
    .withMessage("Coupon's code must be between 5 and 10")
    .custom(async (val) => {
      const coupon = await CouponModel.findOne({ code: val });
      if (coupon) throw new Error("Coupon code already exists");
      return true;
    }),
  check("expireDate")
    .notEmpty()
    .withMessage("Coupon's expiry date is required")
    .isDate()
    .withMessage("Invalid date"),
  check("discount")
    .notEmpty()
    .withMessage("Coupon's discount value is required")
    .isNumeric()
    .withMessage("Coupon's discount should be integer")
    .custom((val) => {
      if (val <= 0 || val > 100)
        throw new Error("Coupon's discount value is invalid");
      return true;
    }),
  validatorMiddleware,
];

export const deleteCouponValidator: RequestHandler[] = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];

export const updateCouponValidator: RequestHandler[] = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  check("code")
    .optional()
    .isLength({ min: 5, max: 10 })
    .withMessage("Coupon's code must be between 5 and 10")
    .custom(async (val, { req }) => {
      const coupon = await CouponModel.findById(req.params?.id);
      if (coupon && coupon.code === val) {
        return true;
      }
      const existingCoupon = await CouponModel.findOne({
        code: val,
      });
      if (existingCoupon) {
        throw new Error("Coupon already exists");
      }
      return true;
    }),
  check("expireDate").optional().isDate().withMessage("Invalid date"),
  check("discount")
    .isNumeric()
    .withMessage("Coupon's discount should be integer")
    .custom((val) => {
      if (val <= 0 || val > 100)
        throw new Error("Coupon's discount value is invalid");
      return true;
    }),
  validatorMiddleware,
];
