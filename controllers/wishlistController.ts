import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import UserModel from "../schemas/userSchema";
import { getDocument } from "./controllerInterface";

export const addProductToWishlist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findByIdAndUpdate(
      req.user?._id,
      {
        $addToSet: { wishlist: req.body.product },
      },
      { new: true }
    );
    res.status(200).json({ data: user?.wishlist });
  }
);
export const removeProductFromWishlist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findByIdAndUpdate(
      req.user?._id,
      {
        $pull: { wishlist: req.params.productId },
      },
      { new: true }
    );
    console.log(user?.wishlist);
    res.status(200).json({ data: user?.wishlist });
  }
);

// Way1
// export const getSignedInUserWishlist = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const user = await UserModel.findById(req.user?._id).populate('wishlist');
//     res.status(200).json({ length: user?.wishlist.length, data: user?.wishlist })
// });

// Way2
export const getSignedInUserWishlist = getDocument(UserModel, "wishlist");
