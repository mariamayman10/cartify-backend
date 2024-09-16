import Jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import UserModel from "../schemas/userSchema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ApiErrors from "../utils/apiErrors";
import { createResetToken, createToken } from "../utils/createToken";
import { sendMail } from "../utils/sendMail";

export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.create(req.body);
    const token = createToken(user._id);
    res.status(201).json({ token, data: user });
  }
);

export const signIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return next(new ApiErrors("Invalid email or password", 401));
    }
    const token = createToken(user._id);
    res.status(200).json({ token, message: "logged in successfully" });
  }
);

export const applyProtection = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // check if token exist
    let token: string = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      // check if there is a token, and its type is bearer
      token = req.headers.authorization.split(" ")[1];
    else return next(new ApiErrors("Login first to be able to access", 401));

    // check if token is still active
    const decryptedToken: any = Jwt.verify(token, process.env.JWT_SECRET_KEY!);

    // check if user exist
    const user = await UserModel.findById(decryptedToken._id);
    if (!user) return next(new ApiErrors("User doesn't exist", 401));

    // check if password changed
    if (user.passwordChangedAt instanceof Date) {
      const lastChanged: number = parseInt(
        (user.passwordChangedAt.getTime() / 1000).toString()
      );
      if (lastChanged > decryptedToken.iat)
        return next(new ApiErrors("Login again", 401));
    }
    req.user = user;
    next();
  }
);

export const allowedTo = (...roles: string[]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role ?? "")) {
      console.log(roles, req.user?.role);
      return next(new ApiErrors("You don't have the permission", 403));
    }
    next();
  });

export const checkActive = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.active) {
      return next(new ApiErrors("You are not active", 403));
    }
    next();
  }
);

export const forgetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return next(new ApiErrors("User not found", 404));
    }
    const resetCode: string = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    user.resetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
    user.resetCodeExpireTime = Date.now() + 10 * 60 * 1000;
    user.resetCodeVerify = false;
    const emailMessage = `Your reset code is ${resetCode}`;
    try {
      await sendMail({
        email: user.email,
        subject: "Reset Password",
        message: emailMessage,
      });
      await user.save({ validateModifiedOnly: true });
    } catch (err) {
      console.log(err);
      return next(new ApiErrors("Failed to send email", 400));
    }
    const resetToken: string = createResetToken(user._id);
    res
      .status(200)
      .json({ message: "Reset code is sent to your email", resetToken });
  }
);

export const verifyResetCode = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let resetToken: string = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      // check if there is a token, and its type is bearer
      resetToken = req.headers.authorization.split(" ")[1];
    else return next(new ApiErrors("You don't have the permission", 400));

    const decryptedToken: any = Jwt.verify(
      resetToken,
      process.env.JWT_SECRET_KEY!
    );
    const user = await UserModel.findOne({
      _id: decryptedToken._id,
      resetCode: crypto
        .createHash("sha256")
        .update(req.body.resetCode)
        .digest("hex"),
      resetCodeExpireTime: { $gt: Date.now() },
    });
    if (!user) return next(new ApiErrors("invalid or expired reset code", 400));
    user.resetCodeVerify = true;
    await user.save({ validateModifiedOnly: true });
    res.status(200).json({ message: "Reset code verified" });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let resetToken: string = "";
    console.log("in");
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      // check if there is a token, and its type is bearer
      resetToken = req.headers.authorization.split(" ")[1];
    else return next(new ApiErrors("You don't have the permission", 400));

    const decryptedToken: any = Jwt.verify(
      resetToken,
      process.env.JWT_SECRET_KEY!
    );
    const user = await UserModel.findOne({
      _id: decryptedToken._id,
      resetCodeVerify: true,
    });
    console.log(resetToken, decryptedToken, user);
    if (!user) return next(new ApiErrors("verify your reset code first", 400));
    user.password = req.body.password;
    user.resetCode = undefined;
    user.resetCodeExpireTime = undefined;
    user.resetCodeVerify = undefined;
    user.passwordChangedAt = Date.now();
    await user.save({ validateModifiedOnly: true });
    res.status(200).json({ message: "Password changed successfully" });
  }
);
