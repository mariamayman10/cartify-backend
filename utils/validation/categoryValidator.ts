import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import SubcategoryModel from "../../schemas/subcategorySchema";
import Subcategory from "../../interfaces/subcategory";
import CategoryModel from "../../schemas/categorySchema";

export const getCategoryValidator: RequestHandler[] = [
  check("id").isMongoId().withMessage("Invalid Mongo ID"),
  validatorMiddleware,
];

export const createCategoryValidator: RequestHandler[] = [
  check("name")
    .notEmpty()
    .withMessage("Category's name is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Category's name must have length between 2 and 20")
    .custom(async (val: string) => {
      const category = await CategoryModel.findOne({ name: val });
      if (category) {
        throw new Error("Category already exist");
      }
      return true;
    }),
  check("image").optional(),

  validatorMiddleware,
];

export const deleteCategoryValidator: RequestHandler[] = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Mongo ID")
    .custom(async (val) => {
      const subcategories: Subcategory[] = await SubcategoryModel.find({
        category: val,
      });
      if (subcategories.length > 0) {
        await SubcategoryModel.bulkWrite(
          subcategories.map((subcategory: Subcategory) => ({
            deleteOne: { filter: { _id: subcategory.id } },
          }))
        );
      }
      return true;
    }),
  validatorMiddleware,
];

export const updateCategoryValidator: RequestHandler[] = [
  check("id").isMongoId().withMessage("Invalid Mongo ID"),
  check("name")
    .notEmpty()
    .withMessage("Category's name is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Category's name must have length between 2 and 20")
    .custom(async (val: string) => {
      const category = await CategoryModel.findOne({ name: val });
      if (category) {
        throw new Error("Category already exist");
      }
      return true;
    }),
  validatorMiddleware,
];
