import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import UserModel from "../../schemas/userSchema";

export const signUpValidator: RequestHandler[] = [
  check("name")
    .notEmpty()
    .withMessage("User's name is required")
    .isLength({ min: 7, max: 20 })
    .withMessage("Name length should be between 7 and 20"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (val: string) => {
      const user = await UserModel.findOne({ email: val });
      if (user) {
        throw new Error(`Email already exists`);
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password's length should be between 8 and 20 char")
    .custom((val: string, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("confirm password length should be between 8 and 20 char"),

  validatorMiddleware,
];

export const signInValidator: RequestHandler[] = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not a valid email"),
  check("password").notEmpty().withMessage("Password is required"),
  validatorMiddleware,
];

export const forgetPasswordValidator: RequestHandler[] = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not a valid email"),
  validatorMiddleware,
];

export const verifyResetCodeValidator: RequestHandler[] = [
  check("resetCode")
    .notEmpty()
    .withMessage("Reset code is required")
    .isLength({ max: 6, min: 6 })
    .withMessage("Invalid reset code"),
  validatorMiddleware,
];

export const ResetPasswordValidator: RequestHandler[] = [
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password's length should be between 8 and 20 char"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("confirm password length should be between 8 and 20 char")
    .custom((val: string, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
  validatorMiddleware,
];
