import { Router } from "express";
import { allowedTo, checkActive, applyProtection } from "../controllers/authenticationController";
import { addProductToCart, applyCoupon, clearCart, getSignedInUserCart, removeProductFromCart, updateProductQuantity } from "../controllers/cartController";
import { addProductToCartValidator, removeProductFromCartValidator, updateProductQuantityValidator } from "../utils/validation/cartValidator";

const CartRoutes: Router = Router();
CartRoutes.use(applyProtection, checkActive, allowedTo('user'))

CartRoutes.route('/')
    .get(getSignedInUserCart)
    .post(addProductToCartValidator, addProductToCart)
    .delete(clearCart)

CartRoutes.put('/applyCoupon', applyCoupon)

CartRoutes.route('/:productId')
    .put(updateProductQuantityValidator, updateProductQuantity)
    .delete(removeProductFromCartValidator, removeProductFromCart)


export default CartRoutes;