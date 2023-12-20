// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

const loadShippingInfoFromLocalStorage = () => {
  const savedShippingInfo = localStorage.getItem("shippingInfo");
  return savedShippingInfo ? JSON.parse(savedShippingInfo) : {};
};

const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const saveShippingInfoToLocalStorage = (shippingInfo) => {
  localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromLocalStorage(),
    shippingInfo: loadShippingInfoFromLocalStorage(),
  },
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.product === newItem.product
      );

      if (existingItemIndex !== -1) {
        // If item already exists, update the quantity
        state.items[existingItemIndex].quantity = newItem.quantity;
      } else {
        // If item does not exist, add it to the cart
        state.items.push(newItem);
      }
      saveCartToLocalStorage(state.items);
    },
    incrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.items.find((item) => item.product === itemId);

      if (item && item.quantity < item.stock) {
        item.quantity += 1;
        saveCartToLocalStorage(state.items);
      }
    },
    decrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.items.find((item) => item.product === itemId);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCartToLocalStorage(state.items);
      }
    },
    removeItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.product !== id);
      saveCartToLocalStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
    },

    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      saveShippingInfoToLocalStorage(state.shippingInfo);
    },
  },
});

export const {
  addItem,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  clearCart,
  setShippingInfo,
} = cartSlice.actions;
export default cartSlice.reducer;
