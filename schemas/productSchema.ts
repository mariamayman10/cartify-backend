import { Schema, model } from "mongoose";
import Product from "../interfaces/product";

const ProductSchema: Schema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 30,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 300,
    },
    price: { type: Number, required: true, min: 1, max: 1000000 },
    priceAfterDiscount: { type: Number, min: 1, max: 1000000 },
    quantity: { type: Number, min: 1, max: 1000000 },
    sold: { type: Number, default: 0, min: 0 },
    ratingAverage: { type: Number, min: 0, max: 5, default: 0 },
    ratingCount: { type: Number, default: 0 },
    cover: String,
    images: [String],
    category: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
    subcategory: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Subcategory",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

ProductSchema.pre<Product>(/^find/, function (next) {
  this.populate({ path: "category", select: "name" });
  this.populate({ path: "subcategory", select: "name" });
  next();
});

const ProductModel = model<Product>("Product", ProductSchema);

export default ProductModel;
