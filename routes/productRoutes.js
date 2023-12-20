import express from "express";
import {
  adminGetAllProducts,
  createProduct,
  createProductReview,
  deleteProduct,
  deleteProductReview,
  deleteProductReviewAdmin,
  getAllCategories,
  getAllProducts,
  getProductReviews,
  getSingleProduct,
  updateProduct,
} from "../controller/productController.js";
import { isAdmin, verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/categories", getAllCategories);
router.get("/product/:id", getSingleProduct);

router.put("/product/:id/review", verifyToken, createProductReview);
router.delete("/product/:id/review", verifyToken, deleteProductReview);
router.get("/reviews", getProductReviews);

// -------------------------------Admin-----------------------------------------
router.get("/admin/products", verifyToken, isAdmin, adminGetAllProducts);
router.post("/product/new", verifyToken, isAdmin, createProduct);
router.put("/product/update/:id", verifyToken, isAdmin, updateProduct);
router.delete("/product/delete/:id", verifyToken, isAdmin, deleteProduct);

router.delete(
  "/product/review",
  verifyToken,
  isAdmin,
  deleteProductReviewAdmin
);

export default router;
