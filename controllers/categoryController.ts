import { createDocument, deleteDocument, getDocument, getDocuments, updateDocument } from "./controllerInterface";
import asyncHandler from 'express-async-handler';
import Category from "../interfaces/category";
import CategoryModel from "../schemas/categorySchema";
import sharp from "sharp";
import { Request, Response, NextFunction } from "express";
import { uploadSingleImage } from "../middlewares/imagesMiddleware";

export const uploadCategoryImage = uploadSingleImage('image');
export const resizeCategoryImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if(req.file){
        const categoryImage: string = `Category-${Date.now()}.jpeg`
        await sharp(req.file.buffer)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/categories/${categoryImage}`);
        req.body.image = categoryImage;
    }
    next();
});


export const createCategory = createDocument<Category>(CategoryModel);
export const updateCategory = updateDocument<Category>(CategoryModel);
export const deleteCategory = deleteDocument<Category>(CategoryModel);
export const getCategory = getDocument<Category>(CategoryModel);
export const getCategories = getDocuments<Category>(CategoryModel, 'Category');

