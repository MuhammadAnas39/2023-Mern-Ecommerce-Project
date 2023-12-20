// store.js
import { configureStore } from "@reduxjs/toolkit";
import productReducer, { reviewsSlice } from "./productSlice";
import userReducer, { adminUsersSlice } from "./userSlice";
import profileReducer from "./profileSlice";
import cartReducer from "./cartSlice";
import {
  allOrdersSlice,
  deleteOrderSlice,
  myOrdersSlice,
  orderDetailSlice,
  orderSlice,
  updateOrderSlice,
} from "./orderSlice";
import { newReviewSlice } from "./newReview";

export const store = configureStore({
  reducer: {
    products: productReducer,
    user: userReducer,
    adminUser: adminUsersSlice.reducer,
    profile: profileReducer,
    cart: cartReducer,
    order: orderSlice.reducer,
    myOrders: myOrdersSlice.reducer,
    orderDetail: orderDetailSlice.reducer,
    allOrders: allOrdersSlice.reducer,
    updateOrder: updateOrderSlice.reducer,
    deleteOrder: deleteOrderSlice.reducer,
    newReview: newReviewSlice.reducer,
    reviews: reviewsSlice.reducer,
    // Add other reducers as needed
  },
});
