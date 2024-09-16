import { Router } from "express";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controllers/categoryController";
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from "../utils/validation/categoryValidator";
import SubcategoryRoutes from "./subcategoryRoutes";
import { allowedTo, applyProtection, checkActive } from "../controllers/authenticationController";

const CategoryRoutes: Router = Router();

CategoryRoutes.use('/:categoryId/subcategory', SubcategoryRoutes);

CategoryRoutes.route('/')
    .get(getCategories)
    .post(applyProtection, checkActive, allowedTo('manager', 'admin'), createCategoryValidator,  createCategory);
CategoryRoutes.route('/:id')
    .get(getCategoryValidator, getCategory)
    .delete(applyProtection, checkActive,  allowedTo('manager', 'admin'), deleteCategoryValidator, deleteCategory)
    .put(applyProtection, checkActive, allowedTo('manager', 'admin'), updateCategoryValidator, updateCategory);

export default CategoryRoutes;