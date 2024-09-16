
import { NextFunction, Request, Response  } from 'express';
import asyncHandler from 'express-async-handler';
import CartModel from '../schemas/cartSchema';
import ApiErrors from '../utils/apiErrors';
import ProductModel from '../schemas/productSchema';
import { Cart, CartProduct } from '../interfaces/cart';
import CouponModel from '../schemas/couponSchema';

export const getSignedInUserCart = asyncHandler(async (req:Request, res:Response, next: NextFunction) => {
    const cart = await CartModel.findOne({user: req.user?._id});
    if(!cart) return next(new ApiErrors('User doesn\'t have a cart yet', 404));
    res.status(200).json({length: cart.cartItems.length, data: cart});
});
export const addProductToCart = asyncHandler(async (req:Request, res:Response, next: NextFunction) => {
    const product = await ProductModel.findById(req.body.product);
    if(!product) return next(new ApiErrors('Product not found', 404));
    let cart: any = await CartModel.findOne({user: req.user?._id});
    if(cart){
        const productIndex = cart.cartItems.findIndex((item: CartProduct) => item.product._id!.toString() == req.body.product.toString());
        if(productIndex > -1){
            cart.cartItems[productIndex].quantity++;
        }else{
            cart.cartItems.push({product: req.body.product, price: product.price})
        }
    }else{
        cart = await CartModel.create({
            user: req.user?._id,
            cartItems: [{product: req.body.product, price: product.price}],
        });
    }
    calculateTotalPrice(cart);
    cart.save();
    res.status(200).json({length: cart.cartItems.length, data: cart});
});
export const removeProductFromCart = asyncHandler(async (req:Request, res:Response, next: NextFunction) => {
    let cart: any = await CartModel.findOneAndUpdate({user: req.user?._id}, {
        $pull: {cartItems: {_id: req.params.productId}}
    }, {new: true});
    calculateTotalPrice(cart);
    cart.save();
    res.status(200).json({length: cart.cartItems.length, data: cart});
});
export const updateProductQuantity = asyncHandler(async (req:Request, res:Response, next: NextFunction) => {
    const cart: any = await CartModel.findOne({user: req.user?._id});
    const productIndex = cart.cartItems.findIndex((item: CartProduct) => item._id!.toString() == req.params.productId.toString());
    if (productIndex > -1) cart.cartItems[productIndex].quantity = req.body.quantity;
    else return next(new ApiErrors('Product not found', 404))
    calculateTotalPrice(cart);
    cart.save();
    res.status(200).json({length: cart.cartItems.length, data: cart});
});
export const clearCart = asyncHandler(async (req:Request, res:Response, next: NextFunction) => {
    await CartModel.findOneAndDelete({user: req.user?._id});
    res.status(204).json();
});
export const applyCoupon = asyncHandler(async (req:Request, res:Response, next: NextFunction) => {
    const coupon = await CouponModel.findOne({code: req.body.code, expireDate: {$gt: Date.now()}});
    if(!coupon) return next(new ApiErrors('Invalid or expired coupon code', 400));
    const cart: any = await CartModel.findOne({user: req.user?._id});
    const totalPriceAfterDiscount = (cart!.totalPrice - (cart!.totalPrice * (coupon.discount / 100))).toFixed(2);
    cart!.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart!.save();
    res.status(200).json({ length: cart!.cartItems.length, data: cart });
});


const calculateTotalPrice = (cart: Cart): number => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => totalPrice += item.price * item.quantity);
    cart.totalPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
}