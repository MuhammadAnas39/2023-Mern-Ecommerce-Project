import productModel from "../models/productModel.js";
import cloudinary from "cloudinary";

// -------------------------ADMIN----------------------------
export const createProduct = async (req, res) => {
  try {
    req.body.user = req.user.id;

    const images = Array.isArray(req.body.images)
      ? req.body.images
      : [req.body.images];
    const uploadedImages = [];
    const uploadErrors = [];

    for (let i = 0; i < images.length; i++) {
      try {
        const image = images[i];
        const result = await cloudinary.v2.uploader.upload(image, {
          folder: "product", // Specify the folder name
          width: 300, // Set the desired width
          crop: "scale", // Set the crop mode to scale
        });

        uploadedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      } catch (uploadError) {
        // Handle the error for the specific image
        uploadErrors.push({ error: uploadError.message });
      }
    }

    // If there are image upload errors, return the errors
    if (uploadErrors.length > 0) {
      return res.status(500).json({
        success: false,
        message: "There are some issue with your images please try again!",
        errors: uploadErrors,
      });
    }

    // Add the uploaded images to the productData
    const productData = {
      // Add other product data here
      ...req.body,
      images: uploadedImages,
    };

    const product = await productModel.create(productData);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in creating product",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, totalRating } = req.query;

    const filters = {};

    if (keyword) {
      filters.name = { $regex: new RegExp(keyword, "i") };
    }
    if (minPrice && maxPrice) {
      filters.price = {
        $gte: parseFloat(minPrice),
        $lte: parseFloat(maxPrice),
      };
    }
    if (category) {
      filters.category = category;
    }
    if (totalRating) {
      filters.totalRating = {
        $lte: parseFloat(totalRating),
      };
    }

    const productCount = await productModel.countDocuments(filters);

    const products = await productModel.find(filters);
    res.status(200).json({ success: true, productCount, products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};
export const adminGetAllProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await productModel.distinct("category");
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting categories",
      error: error.message,
    });
  }
};

// -------------------------ADMIN----------------------------
export const updateProduct = async (req, res) => {
  try {
    let product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let uploadedImages = [];
    if (req.body.images && req.body.images.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        const image = product.images[i];
        await cloudinary.uploader.destroy(image.public_id);
      }

      // Upload new images to Cloudinary
      const newImages = Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images];

      uploadedImages = await Promise.all(
        newImages.map(async (image) => {
          const result = await cloudinary.v2.uploader.upload(image, {
            folder: "product",
            width: 300,
            crop: "scale",
          });

          return {
            public_id: result.public_id,
            url: result.secure_url,
          };
        })
      );
    }

    // Update other fields
    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    product.stock = req.body.stock;
    product.category = req.body.category;

    // Conditionally update the images field
    if (req.body.images && uploadedImages.length > 0) {
      product.images = uploadedImages;
    }

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in updating product",
      error: error.message,
    });
  }
};

// -------------------------ADMIN----------------------------
export const deleteProduct = async (req, res) => {
  try {
    let product = await productModel.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.images && product.images.length > 0) {
      const deleteImagePromises = product.images.map(async (image) => {
        await cloudinary.v2.uploader.destroy(image.public_id);
      });

      await Promise.all(deleteImagePromises);
    }

    // Delete the product from the database
    product = await productModel.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in deleting product",
      error: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    let product = await productModel.findById(req.params.id);

    if (!product) {
      return res
        .status(500)
        .json({ success: false, message: "product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error in single product",
      error: error.message,
    });
  }
};

// --------------------------------REVIEWS-----------------------------------------

export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = {
      name: req.user.name,
      user: req.user.id,
      rating,
      comment,
    };

    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = product.reviews.find(
      (review) => review.user.toString() === req.user.id
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      product.reviews.push(review);
    }

    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const numOfReviews = product.reviews.length;

    product.totalRating = totalRating / numOfReviews;
    product.numOfReviews = numOfReviews;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review created/updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "error in creating review",
      error: error.message,
    });
  }
};

export const deleteProductReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const product = await productModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const existingReviewIndex = product.reviews.findIndex(
      (review) => review.user.toString() === userId
    );

    if (existingReviewIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Remove the review from the product's reviews array
    product.reviews.splice(existingReviewIndex, 1);

    // Recalculate totalRating and numOfReviews
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const numOfReviews = product.reviews.length;

    product.totalRating = numOfReviews > 0 ? totalRating / numOfReviews : 0;
    product.numOfReviews = numOfReviews;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting review",
      error: error.message,
    });
  }
};

export const deleteProductReviewAdmin = async (req, res) => {
  try {
    const productId = req.query.productId;
    const reviewId = req.query.reviewId;
    const product = await productModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const existingReviewIndex = product.reviews.findIndex(
      (review) => review._id.toString() === reviewId
    );

    if (existingReviewIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    product.reviews.splice(existingReviewIndex, 1);

    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const numOfReviews = product.reviews.length;

    product.totalRating = numOfReviews > 0 ? totalRating / numOfReviews : 0;
    product.numOfReviews = numOfReviews;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting review",
      error: error.message,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const productId = req.query.id;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = product.reviews;

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in retrieving product reviews",
      error: error.message,
    });
  }
};
