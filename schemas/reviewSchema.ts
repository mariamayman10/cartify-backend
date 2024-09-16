import { Schema, model } from "mongoose";
import { Review } from "../interfaces/review";
import ProductModel from "./productSchema";

const ReviewSchema: Schema = new Schema<Review>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    comment: { type: String, required: true },
    rate: { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true }
);

ReviewSchema.statics.calculateRatingAndCount = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$rate" },
        ratingCount: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingAverage: result[0].avgRating,
      ratingCount: result[0].ratingCount,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingAverage: 0,
      ratingCount: 0,
    });
  }
};
ReviewSchema.post<Review>("save", async function () {
  await (this.constructor as any).calculateRatingAndCount(this.product);
});
ReviewSchema.post<Review>("findOneAndDelete", async function (doc) {
  const reviewDoc = doc as unknown as Review;
  if (reviewDoc.product) {
    await (reviewDoc.constructor as any).calculateRatingAndCount(
      reviewDoc.product
    );
  }
});

ReviewSchema.pre<Review>(/^find/, function (next) {
  this.populate({ path: "user", select: "name image _id" });
  this.populate({ path: "product", select: "cover name" });
  next();
});
ReviewSchema.pre<Review>("find", function (next) {
  this.populate({ path: "product", select: "name cover" });
  next();
});

const ReviewModel = model<Review>("Review", ReviewSchema);

export default ReviewModel;
