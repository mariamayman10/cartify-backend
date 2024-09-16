import { Application, Request, Response, NextFunction } from "express";
import CategoryRoutes from "./categoryRoutes";
import SubcategoryRoutes from "./subcategoryRoutes";
import ApiErrors from "../utils/apiErrors";
import { globalErrors } from "../middlewares/globalErrors";
import * as all from '../interfaces';
import ProductRoutes from "./productRoutes";
import UserRoutes from "./userRoutes";
import AuthenticationRoutes from "./authenticationRoutes";
import ReviewRoutes from "./reviewRoutes";
import WishlistRoutes from "./wishlistRoutes";
import CouponRoutes from "./couponRoutes";
import CartRoutes from "./cartRoutes";
import OrderRoutes from "./orderRoutes";

export const appRoutes = (app:Application):void => {
    app.use('/api/v1/category', CategoryRoutes);
    app.use('/api/v1/subcategory', SubcategoryRoutes);
    app.use('/api/v1/products', ProductRoutes);
    app.use('/api/v1/review', ReviewRoutes);
    app.use('/api/v1/user', UserRoutes);
    app.use('/api/v1/cart', CartRoutes);
    app.use('/api/v1/order', OrderRoutes);
    app.use('/api/v1/coupon', CouponRoutes);
    app.use('/api/v1/wishlist', WishlistRoutes);
    app.use('/api/v1/auth', AuthenticationRoutes);
    app.all('*', (req:Request, res:Response, next:NextFunction) => {
        next(new ApiErrors(`The route ${req.originalUrl} doesn't exist`, 400))
    });
    app.use(globalErrors);
}