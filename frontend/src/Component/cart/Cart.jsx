import React from "react";
import CartCard from "./CartCard.jsx";
import "./cart.css";
import { useDispatch, useSelector } from "react-redux";
import { decrementQuantity, incrementQuantity } from "../../redux/cartSlice.js";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);

  let totalPrice = 0;
  items.map((i) => (totalPrice += i?.price * i?.quantity));

  const dispatch = useDispatch();

  const handleIncrement = (itemId) => {
    dispatch(incrementQuantity(itemId));
  };

  const handleDecrement = (itemId) => {
    dispatch(decrementQuantity(itemId));
  };

  function checkOutHandler() {
    navigate(`${isAuthenticated ? "/shipping" : "/login"}`);
  }
  return (
    <>
      {items?.length < 1 ? (
        <div className="emptyCart">
          <MdOutlineRemoveShoppingCart />
          <h2>No Products In Your Cart</h2>
          <Link to="/products">
            <FaArrowLeft /> Continue To Shopping
          </Link>
        </div>
      ) : (
        <div className="cartContainer">
          <h2 className="cartHeading">Your Cart ({items?.length} items)</h2>

          <div className="mainCartBox">
            <p>Item</p>
            <p>Quantity</p>
            <p>Total</p>
          </div>

          {items?.map((item) => (
            <div key={item?.product} className="cartContent">
              <CartCard item={item} />

              <div className="cartQuantityDiv">
                <button
                  className="decrement"
                  onClick={() => handleDecrement(item?.product)}
                >
                  -
                </button>
                <input type="text" value={item?.quantity} readOnly />
                <button
                  className="increment"
                  onClick={() => handleIncrement(item?.product)}
                >
                  +
                </button>
              </div>

              <span>${item?.quantity * item?.price}</span>
            </div>
          ))}

          <div className="cartSubtotalBox">
            <div>
              <p>Gross Total:</p>
              <p>${totalPrice}.00</p>
            </div>
            <button onClick={checkOutHandler}>Check Out</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
