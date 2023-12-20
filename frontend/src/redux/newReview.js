// productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {};
const serverURL = "https://2023-mern-ecommerce-backend.vercel.app";

// Async action to fetch products from an API
export const createReview = createAsyncThunk(
  "review/new",
  async ({ id, reviewData }) => {
    try {
      //   const id = reviewData.id;
      const link = `${window.location.origin}/api/v1/product/${id}/review`;
      const { data } = await axios.put(link, reviewData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data?.success;
    } catch (error) {
      if (error?.response) {
        throw error?.response?.data;
      } else {
        throw error;
      }
    }
  }
);

export const newReviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = newReviewSlice.actions;
