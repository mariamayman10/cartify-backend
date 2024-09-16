import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const createOrderValidator: RequestHandler[] = [
    check('street').notEmpty().withMessage('Street name is required')
        .isLength({ min: 3, max: 50 }).withMessage('City name length should be between 3 and 50'),
    check('city').notEmpty().withMessage('City name is required')
        .isLength({ min: 3, max: 50 }).withMessage('City name length should be between 3 and 50'),
    check('state').notEmpty().withMessage('State name is required')
        .isLength({ min: 3, max: 50 }).withMessage('State name length should be between 3 and 50'),        
    check('apartmentNo').notEmpty().withMessage('apartmentNo is required')    
        .isLength({ min: 1, max: 5 }).withMessage('apartmentNo length should be between 1 and 5'),
    validatorMiddleware
]

export const orderIdValidator: RequestHandler[] = [
    check('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware
]