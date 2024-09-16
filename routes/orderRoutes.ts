import { Router } from "express";
import { allowedTo, applyProtection, checkActive } from "../controllers/authenticationController";
import { createOrder, deliverOrder, filterOrders, getOrder, getOrders, payOrder } from "../controllers/orderController";
import { createOrderValidator, orderIdValidator } from "../utils/validation/orderValidator";


const OrderRoutes: Router = Router();
OrderRoutes.use(applyProtection, checkActive);

OrderRoutes.route('/')
    .get(filterOrders, getOrders)
    .post(allowedTo('user'), createOrderValidator, createOrder)

OrderRoutes.get('/:id', orderIdValidator, getOrder)

OrderRoutes.use(allowedTo('manager', 'admin'));
OrderRoutes.put('/:id/pay', orderIdValidator, payOrder);
OrderRoutes.put('/:id/deliver', orderIdValidator, deliverOrder);

export default OrderRoutes;
