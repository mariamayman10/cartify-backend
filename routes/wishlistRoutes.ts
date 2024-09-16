import { Router } from "express";
import { applyProtection, allowedTo, checkActive } from "../controllers/authenticationController";
import { addProductToWishlist, getSignedInUserWishlist, removeProductFromWishlist } from "../controllers/wishlistController";

const WishlistRoutes: Router = Router();

WishlistRoutes.use(applyProtection, checkActive, allowedTo('user'))

WishlistRoutes.route('/')
    .get(getSignedInUserWishlist)
    .post(addProductToWishlist)
WishlistRoutes.route('/:productId')
    .delete(removeProductFromWishlist)

export default WishlistRoutes;