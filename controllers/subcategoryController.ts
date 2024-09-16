import SubcategoryModel from "../schemas/subcategorySchema";
import { createDocument, deleteDocument, getDocument, getDocuments, updateDocument } from "./controllerInterface";
import Subcategory from "../interfaces/subcategory";
import FilterData from "../interfaces/filterData";
import sharp from "sharp";
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from "express";
import { uploadSingleImage } from "../middlewares/imagesMiddleware";

export const uploadSubcategoryImage = uploadSingleImage('image');
export const resizeSubcategoryImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if(req.file){
        const subcategoryImage: string = `Subcategory-${Date.now()}.jpeg`
        await sharp(req.file.buffer)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/subcategories/${subcategoryImage}`);
        req.body.image = subcategoryImage;
    }
    next();
});
export const filterSubcategories = (req:Request, res:Response, next: NextFunction) => {
    let filterDataObj:FilterData = {};
    if(req.params.categoryId){
        filterDataObj.category = req.params.categoryId;
    }
    req.filterData = filterDataObj;
    next();
}
export const setCategoryId = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.category) req.body.category = req.params.categoryId
    next();
};

export const createSubcategory = createDocument<Subcategory>(SubcategoryModel);
export const updateSubcategory = updateDocument<Subcategory>(SubcategoryModel);
export const deleteSubcategory = deleteDocument<Subcategory>(SubcategoryModel);
export const getSubcategory = getDocument<Subcategory>(SubcategoryModel);
export const getSubcategories = getDocuments<Subcategory>(SubcategoryModel, 'Subcategory');


