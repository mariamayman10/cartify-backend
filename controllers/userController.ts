import UserModel from "../schemas/userSchema";
import { User } from "../interfaces/user";
import { createDocument, deleteDocument, getDocument, getDocuments, updateDocument } from "./controllerInterface";
import asyncHandler from 'express-async-handler';
import sharp from "sharp";
import { Request, Response, NextFunction } from "express";
import { uploadSingleImage } from "../middlewares/imagesMiddleware";
import bcrypt from 'bcryptjs';
import ApiErrors from "../utils/apiErrors";
import { createToken } from "../utils/createToken";

export const uploadUserImage = uploadSingleImage('image');
export const resizeUserImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if(req.file){
        const userImage: string = `User-${Date.now()}.jpeg`
        await sharp(req.file.buffer)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/users/${userImage}`);
        req.body.image = userImage;
    }
    next();
});


export const getSignInUser = asyncHandler(( req: Request, res: Response, next: NextFunction) => {
    req.params.id = req.user?._id!.toString();
    next();
});
export const updateSignedInUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findByIdAndUpdate(req.user?._id, {
        name: req.body.name,
        image: req.body.image,
    }, { new: true })
    res.status(200).json({ data: user, message: 'User is updated successfully' })
});
export const changeSignedInUserPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findByIdAndUpdate(req.user?._id, {
        password: await bcrypt.hash(req.body.newPassword, 13),
        passwordChangedAt: Date.now()
    }, {new:true});
    const token = createToken(user?._id);
    res.status(200).json({token, message: 'User\'s password is changed successfully'});
});
export const addAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const address = {
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      apartmentNo: req.body.apartmentNo,
    };
    const user = await UserModel.findByIdAndUpdate(
      req.user?._id,
      {
        $push: { addresses: address },
      },
      { new: true }
    );
    res.status(200).json({ data: user?.addresses });
  }
);
export const removeAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findByIdAndUpdate(
      req.user?._id,
      {
        $pull: {
          addresses: {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            apartmentNo: req.body.apartmentNo,
          },
        },
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({ data: user?.addresses });
  }
);
export const getAddresses = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({ data: req.user?.addresses });
};
export const getAddress = (req: Request, res: Response, next: NextFunction) => {
  const address = req.user?.addresses.filter((item) => {
    item.street === req.body.street &&
      item.city === req.body.city &&
      item.state === req.body.state &&
      item.apartmentNo === req.body.apartmentNo;
  });
  if (!address) return next(new ApiErrors("Address not found", 404));
  res.status(200).json({ data: address });
};


export const createUser = createDocument<User>(UserModel);
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        image: req.body.image,
        active: req.body.active
    }, { new: true })
    if (!user) { return next(new ApiErrors('User is not found', 404)) };
    res.status(200).json({ data: user, message: 'User is updated successfully' })
});
export const deleteUser = deleteDocument<User>(UserModel);
export const getUser = getDocument<User>(UserModel);
export const getUsers = getDocuments<User>(UserModel, 'User');
export const changeUserPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      {
        password: await bcrypt.hash(req.body.newPassword, 13),
        passwordChangedAt: Date.now(),
      },
      { new: true }
    );
    if (!user) {
      return next(new ApiErrors("User is not found", 404));
    }
    res
      .status(200)
      .json({ message: "User's password is changed successfully", data: user });
  }
);

