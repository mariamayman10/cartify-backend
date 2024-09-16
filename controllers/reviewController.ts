import { Request, Response, NextFunction } from "express";
import { createDocument, deleteDocument, getDocument, getDocuments, updateDocument } from "./controllerInterface";
import { Review } from "../interfaces/review";
import ReviewModel from "../schemas/reviewSchema";
import FilterData from "../interfaces/filterData";

export const filterReviews = (req:Request, res:Response, next: NextFunction) => {
    let filterDataObj:FilterData = {};
    if(req.params.productId){
        filterDataObj.product = req.params.productId;
    }
    if(req.user?.role === 'user' && !req.params.productId){
        filterDataObj.user = req.user._id;
    }
    req.filterData = filterDataObj;
    next();
};

export const getProductAndUserId = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.product) { req.body.product = req.params.productId };
    if (!req.body.user) { req.body.user = req.user?._id };
    next();
};


export const createReview = createDocument<Review>(ReviewModel);
export const updateReview = updateDocument<Review>(ReviewModel);
export const deleteReview = deleteDocument<Review>(ReviewModel);
export const getReview = getDocument<Review>(ReviewModel);
export const getReviews = getDocuments<Review>(ReviewModel, 'Review');