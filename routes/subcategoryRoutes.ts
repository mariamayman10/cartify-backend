import { Router } from "express";
import { createSubcategory, deleteSubcategory, filterSubcategories, getSubcategories, getSubcategory, setCategoryId, updateSubcategory } from "../controllers/subcategoryController";
import { createSubcategoryValidator, getSubcategoryValidator, updateSubcategoryValidator } from "../utils/validation/subcategoryValidator";
import { deleteSubcategoryValidator } from './../utils/validation/subcategoryValidator';
import ProductRoutes from "./productRoutes";
import { allowedTo, applyProtection, checkActive } from "../controllers/authenticationController";

const SubcategoryRoutes: Router = Router({mergeParams: true});

SubcategoryRoutes.use('/:subcategoryId/product',ProductRoutes);

SubcategoryRoutes.route('/')
    .get(filterSubcategories, getSubcategories)
    .post(applyProtection, checkActive, allowedTo('manager', 'admin'), setCategoryId, createSubcategoryValidator, createSubcategory);
SubcategoryRoutes.route('/:id')
    .get(getSubcategoryValidator, getSubcategory)
    .delete(applyProtection, checkActive, allowedTo('manager', 'admin'), deleteSubcategoryValidator, deleteSubcategory)
    .put(applyProtection, checkActive, allowedTo('manager', 'admin'), updateSubcategoryValidator ,updateSubcategory);

export default SubcategoryRoutes;