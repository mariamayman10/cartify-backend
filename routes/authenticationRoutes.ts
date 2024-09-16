import { Router } from "express";
import {
  forgetPassword,
  resetPassword,
  signIn,
  signUp,
  verifyResetCode,
} from "../controllers/authenticationController";
import {
  forgetPasswordValidator,
  ResetPasswordValidator,
  signInValidator,
  signUpValidator,
  verifyResetCodeValidator,
} from "../utils/validation/authenticationValidator";
import {
  uploadUserImage,
  resizeUserImage,
} from "./../controllers/userController";

const AuthenticationRoutes: Router = Router();

AuthenticationRoutes.route("/signup").post(
  uploadUserImage,
  resizeUserImage,
  signUpValidator,
  signUp
);
AuthenticationRoutes.route("/signin").post(signInValidator, signIn);
AuthenticationRoutes.route("/forgetPassword").post(
  forgetPasswordValidator,
  forgetPassword
);
AuthenticationRoutes.route("/verifyResetCode").post(
  verifyResetCodeValidator,
  verifyResetCode
);
AuthenticationRoutes.route("/resetPassword").put(
  ResetPasswordValidator,
  resetPassword
);

export default AuthenticationRoutes;
