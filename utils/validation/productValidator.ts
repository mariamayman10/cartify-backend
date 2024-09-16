import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import { RequestHandler } from 'express';
import CategoryModel from "../../schemas/categorySchema";
import SubcategoryModel from "../../schemas/subcategorySchema";



export const getProductValidator: RequestHandler[] = [
    check('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware
];

export const createProductValidator: RequestHandler[] = [
    check('name').notEmpty().withMessage('Product\'s name is required')
        .isLength({min:2, max:30}).withMessage('Product name\'s length should be between 2 and 30'),
    check('description').notEmpty().withMessage('Product\'s description is required')
        .isLength({min:10, max:300}).withMessage('Product description\'s length should be between 10 and 150'),
    check('price').notEmpty().withMessage('Product\'s price is required')
        .isNumeric().withMessage('Product\'s price should be number').toFloat()
        .custom((val) => {
            if(val <= 0 || val > 1000000){throw new Error('Invalid product price')}
            return true;
        }),
    check('priceAfterDiscount').optional()
        .isNumeric().withMessage('Product\'s price should be number').toFloat()
        .custom((val) => {
            if(val <= 0 || val > 1000000){throw new Error('Invalid product price')}
            return true;
        }),
    check('quantity').optional()
    .isNumeric().withMessage('Product\'s quantity should be number').toInt()
    .custom((val) => {
        if(val < 0){throw new Error('Invalid product quantity')}
        return true;
    }),
    check('category').notEmpty().withMessage('Product\'s category is required')
        .isMongoId().withMessage('Invalid Product\'s category id')
        .custom(async (val) => {
            const category = await CategoryModel.findById(val);
            if(!category){throw new Error('No such a category exist')}
            return true;
        }),
    check('subcategory').notEmpty().withMessage('Product\'s subcategory is required')
    .isMongoId().withMessage('Invalid Product\'s subcategory id')
    .custom(async (val, {req}) => {
        const subcategory = await SubcategoryModel.findById(val);
        if(!subcategory){throw new Error('No such a subcategory exist')}
        if(subcategory.category._id!.toString() !== req.body.category.toString()){
            throw new Error('Subcategory doesn\'t belong to the category');
        }
        return true;
    }),
    validatorMiddleware,
];

export const deleteProductValidator: RequestHandler[] = [
    check('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware
];

export const updateProductValidator: RequestHandler[] = [
    check('id').isMongoId().withMessage('Invalid Mongo Id'),
    check('name').optional()
        .isLength({min:2, max:30}).withMessage('Product name\'s length should be between 2 and 30'),
    check('description').optional()
        .isLength({min:10, max:300}).withMessage('Product description\'s length should be between 10 and 150'),
    check('price').optional()
        .isNumeric().withMessage('Product\'s price should be number').toFloat()
        .custom((val) => {
            if(val <= 0 || val > 1000000){throw new Error('Invalid product price')}
            return true;
        }),
    check('priceAfterDiscount').optional()
        .isNumeric().withMessage('Product\'s price should be number').toFloat()
        .custom((val) => {
            if(val <= 0 || val > 1000000){throw new Error('Invalid product price')}
            return true;
        }),
    check('quantity').optional()
    .isNumeric().withMessage('Product\'s quantity should be number').toInt()
    .custom((val) => {
        if(val < 0){throw new Error('Invalid product quantity')}
        return true;
    }),
    check('category').optional()
        .isMongoId().withMessage('Invalid Product\'s category id')
        .custom(async (val) => {
            const category = await CategoryModel.findById(val);
            if(!category){throw new Error('No such a category exist')}
            return true;
        }),
    check('subcategory').optional()
    .isMongoId().withMessage('Invalid Product\'s subcategory id')
    .custom(async (val, {req}) => {
        const subcategory = await SubcategoryModel.findById(val);
        if(!subcategory){throw new Error('No such a subcategory exist')}
        if(subcategory.category._id!.toString() !== req.body.category.toString()){
            throw new Error('Subcategory doesn\'t belong to the category');
        }
        return true;
    }),
    validatorMiddleware,
];