import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {};
const serverURL = "https://2023-mern-ecommerce-backend.vercel.app";

// Async action to update the user profile
export const newOrder = createAsyncThunk(
  "order/newOrder",
  async (orderData) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `${window.location.origin}/api/v1/order/new`,
        orderData,
        config
      );
      return data?.order;
    } catch (error) {
      if (error?.response) {
        throw error?.response?.data;
      } else {
        throw error;
      }
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(newOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(newOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});
export const { clearError } = orderSlice.actions;

export const myOrders = createAsyncThunk("orders/myOrders", async () => {
  try {
    const { data } = await axios.get(
      `${window.location.origin}/api/v1/myorders`
    );
    return data?.order;
  } catch (error) {
    if (error?.response) {
      throw error?.response?.data;
    } else {
      throw error;
    }
  }
});

export const myOrdersSlice = createSlice({
  name: "myOrders",
  initialState: {},
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(myOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(myOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(myOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const { clearError: clearMyOrdersError } = myOrdersSlice.actions;

export const orderDetailFunc = createAsyncThunk("order/detail", async (id) => {
  try {
    const { data } = await axios.get(
      `${window.location.origin}/api/v1/order/${id}`
    );
    return data?.order;
  } catch (error) {
    if (error?.response) {
      throw error?.response?.data;
    } else {
      throw error;
    }
  }
});

export const orderDetailSlice = createSlice({
  name: "order",
  initialState: {},
  reducers: {
    clearOrderDetailErros: (state) => {
      state.error = null;
      state.loading = false;
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderDetailFunc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(orderDetailFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(orderDetailFunc.rejected, (state, action) => {
        state.loading = false;
        state.order = null;
        state.error = action.error;
      });
  },
});

export const { clearOrderDetailErros } = orderDetailSlice.actions;
// -----------------------------------------------------------------ADMIN-------------------------------------------------------------------

export const getAllOrders = createAsyncThunk("all/orders", async () => {
  try {
    const { data } = await axios.get(`${window.location.origin}/api/v1/orders`);
    return data?.orders;
  } catch (error) {
    if (error?.response) {
      throw error?.response?.data;
    } else {
      throw error;
    }
  }
});

export const allOrdersSlice = createSlice({
  name: "allOrders",
  initialState: {},
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.orders = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const deleteOrder = createAsyncThunk("delete/order", async (id) => {
  try {
    const { data } = await axios.delete(
      `${window.location.origin}/api/v1/delete/${id}`
    );
    return data?.success;
  } catch (error) {
    if (error?.response) {
      throw error?.response?.data;
    } else {
      throw error;
    }
  }
});

export const deleteOrderSlice = createSlice({
  name: "deleteOrder",
  initialState: {},
  reducers: {
    clearDeleteOrderErrors: (state) => {
      state.error = null;
      state.orders = null;
      state.isDeleted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});
export const { clearDeleteOrderErrors } = deleteOrderSlice.actions;

export const updateOrder = createAsyncThunk(
  "update/order",
  async ({ id, formData }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.put(
        `${window.location.origin}/api/v1/update/${id}`,
        formData,
        config
      );
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

export const updateOrderSlice = createSlice({
  name: "update",
  initialState: {},
  reducers: {
    clearUpdateOrderErrors: (state) => {
      state.error = null;
      state.orders = null;
      state.isUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const { clearUpdateOrderErrors } = updateOrderSlice.actions;
