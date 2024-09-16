import { Router } from "express";
import { createProduct, deleteProduct, filterData, getProduct, getProducts, resizeProductImages, updateProduct, uploadProductImages,  } from "../controllers/productController";
import { createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from "../utils/validation/productValidator";
import { allowedTo, applyProtection, checkActive } from "../controllers/authenticationController";
import ReviewRoutes from "./reviewRoutes";

const ProductRoutes: Router = Router({mergeParams: true});
ProductRoutes.use('/:productId/review', ReviewRoutes);


ProductRoutes.route('/')
    .get(filterData, getProducts)
    .post(applyProtection, checkActive, allowedTo('manager', 'admin'), uploadProductImages, resizeProductImages,createProductValidator,createProduct);
ProductRoutes.route('/:id')
    .get(getProductValidator, getProduct)
    .delete(applyProtection, checkActive, allowedTo('manager', 'admin'), deleteProductValidator, deleteProduct)
    .put(applyProtection, checkActive, allowedTo('manager', 'admin'), updateProductValidator ,updateProduct);

export default ProductRoutes;