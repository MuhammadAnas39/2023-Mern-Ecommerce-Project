// productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {};
const serverURL = "https://2023-mern-ecommerce-backend.vercel.app";

// Async action to fetch products from an API
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({
    keyword = "",
    priceRange = [0, 30000],
    selectedCategory,
    rating = 5,
  }) => {
    try {
      let link = `${window.location.origin}/api/v1/products?totalRating=${rating}&`;

      if (keyword || selectedCategory) {
        link += `keyword=${keyword}&`;
      }
      if (selectedCategory) {
        link += `category=${selectedCategory}&`;
      }

      link += `minPrice=${Number(priceRange[0])}&maxPrice=${priceRange[1]}`;

      // let link = `/api/v1/products?keyword=${keyword}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`;
      let response = await axios.get(link);
      return response?.data;
    } catch (error) {
      // Check if the error has a response and extract the error message
      if (error?.response) {
        throw error?.response?.data;
      } else {
        throw error; // Fallback to the error message if there's no response
      }
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (productId) => {
    try {
      const response = await axios.get(
        `${window.location.origin}/api/v1/product/${productId}`
      );
      return response.data.product;
    } catch (error) {
      // Check if the error has a response and extract the error message
      if (error?.response) {
        throw error?.response?.data;
      } else {
        throw error; // Fallback to the error message if there's no response
      }
    }
  }
);

// ----------------------------------------------------ADMIN------------------------------------------------------------------

export const getAdminProducts = createAsyncThunk(
  "products/getAdminProducts",
  async () => {
    try {
      const response = await axios.get(
        `${window.location.origin}/api/v1/admin/products`
      );
      return response.data.products;
    } catch (error) {
      // Check if the error has a response and extract the error message
      if (error?.response) {
        throw error?.response?.data;
      } else {
        throw error; // Fallback to the error message if there's no response
      }
    }
  }
);

export const createAdminProduct = createAsyncThunk(
  "product/new",
  async (productData) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post(
        `${window.location.origin}/api/v1/product/new`,
        productData,
        config
      );
      return data;
    } catch (error) {
      // Check if the error has a response and extract the error message
      if (error?.response) {
        throw error?.response?.data;
      } else {
        throw error; // Fallback to the error message if there's no response
      }
    }
  }
);
export const deleteAdminProduct = createAsyncThunk(
  "product/delete",
  async (id) => {
    try {
      const { data } = await axios.delete(
        `${window.location.origin}/api/v1/product/delete/${id}`
      );
      return data;
    } catch (error) {
      if (error?.response) {
        throw error?.response?.data;
      } else {
        throw error; // Fallback to the error message if there's no response
      }
    }
  }
);

export const updateAdminProduct = createAsyncThunk(
  "product/update",
  async ({ id, formData }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.put(
        `${window.location.origin}/api/v1/product/update/${id}`,
        formData,
        config
      );
      return data;
    } catch (error) {
      if (error?.response) {
        throw error?.response?.data;
      } else {
        throw error; // Fallback to the error message if there's no response
      }
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (item) => item.product !== action.payload
      );
    },
    clearError: (state) => {
      state.error = null;
      state.success = false;
      state.isDeleted = false;
      state.isUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ----------------------------------PRODUCT_DETAILS_ACTIONS------------------------------

      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ------------------------------------------------ADMIN-----------------------------------------------------------------------------
      .addCase(getAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createAdminProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
        state.success = action.payload.success;
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message;
      })

      .addCase(deleteAdminProduct.pending, (state) => {
        state.loading = true;
        state.isDeleted = false;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload.success;
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.isDeleted = false;
        state.error = action.error.message;
      })

      .addCase(updateAdminProduct.pending, (state) => {
        state.loading = true;
        state.isUpdated = false;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload.success;
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isUpdated = false;
      });
  },
});

export const { addProduct, removeProduct, clearError } = productSlice.actions;
// export const selectProducts = (state) => state.products;
export default productSlice.reducer;

// ---------------------------------------------------------REVIEWS---------------------------------------------------------------------

export const getProductReviews = createAsyncThunk(
  "product/reviews",
  async (productId) => {
    try {
      const { data } = await axios.get(
        `${window.location.origin}/api/v1/reviews?id=${productId}`
      );
      return data;
    } catch (error) {
      if (error?.response) {
        throw error?.response?.data;
      } else {
        throw error;
      }
    }
  }
);

export const deleteProductReview = createAsyncThunk(
  "delete/review",
  async ({ saveProdID, reviewId }) => {
    try {
      const { data } = await axios.delete(
        `${window.location.origin}/api/v1/product/review/?productId=${saveProdID}&reviewId=${reviewId}`
      );
      return data;
    } catch (error) {
      if (error?.response) {
        throw error?.response?.data;
      } else {
        throw error;
      }
    }
  }
);

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviewsErrors: (state) => {
      state.error = null;
      state.isDeleted = false;
      state.reviews = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteProductReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProductReview.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload.success;
      })
      .addCase(deleteProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearReviewsErrors } = reviewsSlice.actions;
