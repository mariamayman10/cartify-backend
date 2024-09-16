import { Router } from "express";
import {
  allowedTo,
  applyProtection,
  checkActive,
} from "../controllers/authenticationController";
import {
  createReview,
  deleteReview,
  filterReviews,
  getProductAndUserId,
  getReview,
  getReviews,
  updateReview,
} from "../controllers/reviewController";
import {
  createReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
  updateReviewValidator,
} from "../utils/validation/reviewValidation";

const ReviewRoutes: Router = Router({ mergeParams: true });

ReviewRoutes.route("/")
  .get(filterReviews, getReviews)
  .post(
    applyProtection,
    checkActive,
    allowedTo("user"),
    getProductAndUserId,
    createReviewValidator,
    createReview
  );
ReviewRoutes.route("/myReviews").get(
  applyProtection,
  checkActive,
  allowedTo("user"),
  filterReviews,
  getReviews
);
ReviewRoutes.route("/:id")
  .get(getReviewValidator, getReview)
  .delete(
    applyProtection,
    checkActive,
    allowedTo("manager", "admin", "user"),
    deleteReviewValidator,
    deleteReview
  )
  .put(
    applyProtection,
    checkActive,
    allowedTo("user"),
    updateReviewValidator,
    updateReview
  );

export default ReviewRoutes;
