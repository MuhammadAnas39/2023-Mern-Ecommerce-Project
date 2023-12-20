// profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isUpdated: null,
  loading: false,
  error: null,
};
const serverURL = "https://2023-mern-ecommerce-backend.vercel.app";

// Async action to update the user profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.put(
        `${window.location.origin}/api/v1/update`,
        profileData,
        config
      );
      return data?.message;
    } catch (error) {
      if (error?.response) {
        throw error?.response?.data;
      } else {
        throw error;
      }
    }
  }
);
export const changePassword = createAsyncThunk(
  "profile/changepassword",
  async (profileData) => {
    try {
      const { data } = await axios.put(
        `${window.location.origin}/api/v1/change/password`,
        profileData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return data?.message;
    } catch (error) {
      if (error?.response) {
        throw error?.response?.data;
      } else {
        throw error;
      }
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.isUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.isUpdated = null;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.isUpdated = null;
      });

    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.isUpdated = null;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.isUpdated = null;
      });
  },
});
export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;
