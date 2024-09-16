import { Request, Response, NextFunction, RequestHandler } from "express"
import { validationResult } from "express-validator"

const validatorMiddleware:RequestHandler = (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){
        next();
    }
    else{
        return res.status(400).json({errors:errors.array()})
    }
}
export default validatorMiddleware;