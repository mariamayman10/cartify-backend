import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from "express";
import ApiErrors from "../utils/apiErrors";
import mongoose from 'mongoose';
import { Features } from '../utils/features';

export const createDocument = <modelType>(model: mongoose.Model<any>) => asyncHandler (async (req: Request, res:Response, next:NextFunction) => {
    const document: modelType = await model.create(req.body);
    res.status(201).json({data: document});
});

export const updateDocument = <modelType>(model: mongoose.Model<any>) =>  asyncHandler (async (req: Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    const document = await model.findByIdAndUpdate(req.params.id, req.body,{new:true});
    if(!document){return next(new ApiErrors('No document with such an id', 404))};
    document.save();
    res.status(200).json({data: document});
});

export const deleteDocument = <modelType>(model: mongoose.Model<any>) =>  asyncHandler (async (req: Request, res:Response, next:NextFunction) => {
    const document = await model.findOneAndDelete({_id: req.params.id});
    if(!document){return next(new ApiErrors('No document with such an id', 404))};
    res.status(200).json();
});

export const getDocument = <modelType>(model: mongoose.Model<any>, population?: string) => asyncHandler (async (req: Request, res:Response, next:NextFunction) => {
    if(population && population === 'wishlist'){
        req.params.id = req.user?._id!.toString();
    }
    let query = model.findById(req.params.id);
    if (population) { query = query.populate(population) };
    const document = await query;
    if(!document){ return next(new ApiErrors('No document with such an id', 404)) };
    res.status(200).json({data: document});
});

export const getDocuments = <modelType>(model: mongoose.Model<any>, modelName: string) =>  asyncHandler (async (req: Request, res:Response, next:NextFunction) => {
    let searchLength: number = 0;
    if (req.query) {
        const searchResult: Features = new Features(model.find(req.filterData!), req.query).search(modelName).filter();
        const searchData: modelType[] = await searchResult.mongooseQuery;
        searchLength = searchData.length;
    }
    const documentsCount = searchLength || await model.find(req.filterData!).countDocuments()
    const features: Features = new Features(model.find(req.filterData!), req.query).filter().sort().limitFields().search(modelName).pagination(documentsCount);
    const {mongooseQuery, paginationResult} = features;
    const documents: modelType[] = await mongooseQuery;
    res.status(200).json({length: documents.length, pagination:paginationResult, data: documents});
});


