import React from "react";
import OrderSlider from "./OrderSlider";
import "./ConfirmOrder.css";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { items, shippingInfo } = useSelector((state) => state.cart);

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;
  let subTotal = 0;
  items?.map((e) => (subTotal += e.price * e.quantity));
  let shippingCharges = subTotal > 1000 ? 0 : 200;
  let gst = subTotal * 0.18;
  let total = subTotal + shippingCharges + gst;

  function submitHandler() {
    const data = {
      subTotal,
      shippingCharges,
      gst,
      total,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    navigate("/payment");
  }
  return (
    <>
      <OrderSlider stage={1} />

      <h3 className="confirmOrderHeading">Confirm Order</h3>
      <div className="confirmOrderPage">
        <div className="box1">
          <div className="infoBox">
            <h4>Shipping Info</h4>
            <div className="infoArea">
              <div>
                <p>Name:</p>
                <span>{user?.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo?.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>

          <div className="cartItemsBox">
            <h4>Your Cart Items</h4>

            <div className="itemsBox">
              {items?.map((item, index) => (
                <div className="cartItemsContainer" key={item.product}>
                  <div className="itemsFirstPart">
                    <img src={item.image} alt={item.name} />
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                  </div>

                  <p>
                    {item.quantity} X ${item.price} ={" "}
                    <b>{item.quantity * item.price}</b>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="box2">
          <div>
            <h4>Order Summary</h4>
            <div>
              <p>Subtotal:</p>
              <span>${subTotal}</span>
            </div>
            <div>
              <p>Shipping Charges:</p>
              <span>${shippingCharges}</span>
            </div>
            <div>
              <p>GST:</p>
              <span>${gst}</span>
            </div>
            <div className="finalTotal">
              <p>Total:</p>
              <span>${total}</span>
            </div>
            <button onClick={submitHandler}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
