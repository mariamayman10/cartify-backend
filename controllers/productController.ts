import Product from "../interfaces/product";
import ProductModel from "../schemas/productSchema";
import { Response, Request, NextFunction } from "express";
import {
  createDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  updateDocument,
} from "./controllerInterface";
import FilterData from "../interfaces/filterData";
import asyncHandler from "express-async-handler";
import sharp from "sharp";
import { uploadMultipleImage } from "../middlewares/imagesMiddleware";

export const uploadProductImages = uploadMultipleImage([
  { name: "cover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
export const resizeProductImages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.files) {
      if (req.files.cover) {
        const imageName = `Product-${Date.now()}-cover.png`;
        await sharp(req.files.cover[0].buffer)
          .toFormat("png")
          .png({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);
        req.body.cover = imageName;
      }
      if (req.files.images) {
        req.body.images = [];
        await Promise.all(
          req.files.images.map(async (image: any, index: number) => {
            const imageName = `Product-${Date.now()}N${index + 1}.png`;
            await sharp(image.buffer)
              .toFormat("png")
              .png({ quality: 95 })
              .toFile(`uploads/products/${imageName}`);
            req.body.images.push(imageName);
          })
        );
      }
    }
    next();
  }
);

export const filterData = (req: Request, res: Response, next: NextFunction) => {
  let filterDataObj: FilterData = {};
  if (req.params.subcategoryId) {
    filterDataObj.subcategory = req.params.subcategoryId;
  }
  req.filterData = filterDataObj;
  next();
};

export const createProduct = createDocument<Product>(ProductModel);
export const updateProduct = updateDocument<Product>(ProductModel);
export const deleteProduct = deleteDocument<Product>(ProductModel);
export const getProduct = getDocument<Product>(ProductModel, "reviews");
export const getProducts = getDocuments<Product>(ProductModel, "Product");
