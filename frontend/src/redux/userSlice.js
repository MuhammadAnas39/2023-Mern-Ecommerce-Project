// userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {};
const serverURL = "https://2023-mern-ecommerce-backend.vercel.app";
axios.defaults.withCredentials = true;

// Async action to fetch user data from an API
export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `${window.location.origin}/api/v1/login`,
        { email, password },
        config
      );
      return data?.user;
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

export const register = createAsyncThunk("user/register", async (userData) => {
  try {
    // const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.post(
      `${window.location.origin}/api/v1/register`,
      userData,
      {
        withCredentials: true,
      }
    );
    return data?.user;
  } catch (error) {
    // Check if the error has a response and extract the error message
    if (error?.response) {
      throw error?.response?.data;
    } else {
      throw error; // Fallback to the error message if there's no response
    }
  }
});
export const loadUser = createAsyncThunk("user/me", async () => {
  try {
    // const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.get(`${window.location.origin}/api/v1/me`);
    return data?.user;
  } catch (error) {
    // Check if the error has a response and extract the error message
    if (error?.response) {
      throw error?.response?.data;
    } else {
      throw error; // Fallback to the error message if there's no response
    }
  }
});
export const logout = createAsyncThunk("user/logout", async () => {
  try {
    // const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.get(`${window.location.origin}/api/v1/logout`);
    return data?.user;
  } catch (error) {
    // Check if the error has a response and extract the error message
    if (error?.response) {
      throw error?.response?.data;
    } else {
      throw error; // Fallback to the error message if there's no response
    }
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.user = null;
      })

      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer;

export const getAllUsers = createAsyncThunk("users/all", async () => {
  try {
    // const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.get(`${window.location.origin}/api/v1/users`);
    return data;
  } catch (error) {
    // Check if the error has a response and extract the error message
    if (error?.response) {
      throw error?.response?.data;
    } else {
      throw error; // Fallback to the error message if there's no response
    }
  }
});
export const getUserDetail = createAsyncThunk("user/detail", async (id) => {
  try {
    const { data } = await axios.get(
      `${window.location.origin}/api/v1/user/${id}`
    );
    return data;
  } catch (error) {
    if (error?.response) {
      throw error?.response?.data;
    } else {
      throw error;
    }
  }
});

export const deleteUser = createAsyncThunk("user/delete", async (id) => {
  try {
    // const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.delete(
      `${window.location.origin}/api/v1/user/${id}`
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
});
export const updateUserRole = createAsyncThunk(
  "user/update",
  async ({ id, formData }) => {
    try {
      const { data } = await axios.put(
        `${window.location.origin}/api/v1/user/${id}`,
        formData
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

export const adminUsersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearAdminUserErrors: (state) => {
      state.error = null;
      state.message = null;
      state.isDeleted = false;
      state.isUpdated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.user = null;
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.user = null;
      })

      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.user = null;
      })

      .addCase(getUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.user = null;
      })
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.user = null;
      });
  },
});

export const { clearAdminUserErrors } = adminUsersSlice.actions;
