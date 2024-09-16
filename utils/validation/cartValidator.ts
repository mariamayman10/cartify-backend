import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const addProductToCartValidator: RequestHandler[] = [
    check('product').notEmpty().withMessage('Product is required')
        .isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware
]

export const removeProductFromCartValidator: RequestHandler[] = [
    check('productId').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware
]

export const updateProductQuantityValidator: RequestHandler[] = [
    check('productId').isMongoId().withMessage('Invalid Mongo Id'),
    check('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isNumeric().withMessage('Quantity should be a number').toInt()
        .custom((val) => {
            if (val <= 0) throw new Error('Invalid quantity')
            return true;
        }),
    validatorMiddleware
]