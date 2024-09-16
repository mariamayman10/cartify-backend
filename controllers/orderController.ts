import { Request, Response, NextFunction } from "express"
import FilterData from './../interfaces/filterData';
import asyncHandler from 'express-async-handler';
import CartModel from "../schemas/cartSchema";
import ApiErrors from "../utils/apiErrors";
import { Order } from "../interfaces/order";
import OrderModel from "../schemas/orderSchema";
import ProductModel from "../schemas/productSchema";
import { CartProduct } from "../interfaces/cart";
import { getDocument, getDocuments } from "./controllerInterface";

export const filterOrders = (req: Request, res: Response, next: NextFunction) => {
    if(req.user?.role === 'user'){
        const filteredOrders: FilterData = {user: req.user._id};
        req.filterData = filteredOrders;
    }
    next();
}

export const getOrders = getDocuments<Order>(OrderModel, 'Order');

export const getOrder = getDocument<Order>(OrderModel);

export const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const taxPrice: number = 100;
    const cart: any  =  await CartModel.findOne({user: req.user?._id});
    if(!cart) return next(new ApiErrors('Cart not found', 404));
    const cartPrice: number = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
    const totalPrice: number = cartPrice + taxPrice;
    const order: Order = await OrderModel.create({
        cartItems: cart.cartItems,
        user: req.user?._id,
        totalPrice: totalPrice,
        taxPrice: taxPrice,
        address:  {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            apartmentNo: req.body.apartmentNo,
        },
    });
    if(order){
        await ProductModel.bulkWrite(
            cart.cartItems.map((item: CartProduct) => ({
                updateOne: {
                    filter: {_id: item.product._id},
                    update: {$inc: {quantity: -item.quantity, sold: +item.quantity}}
                }
            }))
        )
        await CartModel.findByIdAndDelete(cart._id);
    }
    res.status(200).json({data: order});
});

export const payOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const order = await OrderModel.findByIdAndUpdate(req.params.id,{
        isPaid: true, PaidDate: Date.now()
    }, {new: true});
    if(!order) return next(new ApiErrors('Order not found', 404));
    res.status(200).json({data: order});
})

export const deliverOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const order = await OrderModel.findByIdAndUpdate(req.params.id,{
        isDelivered: true, DeliveredDate: Date.now()
    }, {new: true});
    if(!order) return next(new ApiErrors('Order not found', 404));
    res.status(200).json({data: order});
})