import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import { RequestHandler } from 'express';
import ReviewModel from "../../schemas/reviewSchema";


export const getReviewValidator: RequestHandler[] = [
    check('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware
];

export const createReviewValidator: RequestHandler[] = [
    check('user').notEmpty().withMessage('Review\'s user is required')
        .isMongoId().withMessage('Invalid Mongo id'),
    check('product').notEmpty().withMessage('Review\'s product is required')
        .isMongoId().withMessage('Invalid Mongo id')
        .custom(async (val, {req}) => {
            const review = await ReviewModel.findOne({user: req.user?._id, product: val});
            if(review) throw new Error('You already added a review for this product');
            return true;
        }),
    check('comment').notEmpty().withMessage('Review\'s comment is required'),
    check('rate').notEmpty().withMessage('Review\'s rate is required')
        .isNumeric(),
    validatorMiddleware,
];

export const deleteReviewValidator: RequestHandler[] = [
    check('id').isMongoId().withMessage('Invalid Mongo Id')
    .custom(async (val, {req}) => {
        const review = await ReviewModel.findById(val);
        if(!review) throw new Error('Review Not found');
        if(review.user._id!.toString() != req.user._id.toString()){
            throw new Error('You are not allowed to delete review that is not yours');
        }
        return true;
    }),
    validatorMiddleware
];

export const updateReviewValidator: RequestHandler[] = [
    check('id').isMongoId().withMessage('Invalid Mongo Id')
    .custom(async (val, {req}) => {
        const review = await ReviewModel.findById(val);
        if(!review) throw new Error('Review Not found');
        if(review.user._id!.toString() != req.user._id.toString()){
            throw new Error('You are not allowed to edit review that is not yours');
        }
        return true;
    }),
    validatorMiddleware,
];