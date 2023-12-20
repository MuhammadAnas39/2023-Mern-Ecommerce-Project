// CheckoutForm.js
import React, { useEffect, useState } from "react";
import OrderSlider from "./OrderSlider";
import { FaRegCreditCard, FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineVpnKey } from "react-icons/md";
import "./payment.css";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearError, newOrder } from "../../redux/orderSlice";
import { clearCart } from "../../redux/cartSlice";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { user } = useSelector((state) => state.user);
  const { shippingInfo, items } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.order);
  const stripe = useStripe();
  const elements = useElements();

  const orderData = {
    shippingInfo,
    orderItems: items,
    itemsPrice: orderInfo?.subTotal,
    taxPrice: orderInfo?.gst,
    shppingPrice: orderInfo?.shippingPrice,
    totalPrice: orderInfo?.total,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    // btnRef.current.disabled = true;
    try {
      const { data } = await axios.post(
        `${window.location.origin}/api/v1/payment/process`,
        {
          amount: Math.round(orderInfo?.total * 100, {
            headers: { "Content-Type": "application/json" },
          }),
        }
      );

      const clientSecret = data.clientSecret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user?.name,
            email: user?.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pin,
              country: shippingInfo.country,
            },
          },
        },
      });

      setLoading(false);
      if (result.error) {
        toast.error(result.error.message);
        return;
      }
      if (result.paymentIntent.status === "succeeded") {
        orderData.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };
        dispatch(newOrder(orderData));
        navigate("/success");
        dispatch(clearCart());
      } else {
        toast.error("There's some issue while processing payment");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  return (
    <>
      <OrderSlider stage={2} />

      <h3 className="paymentPageHeading">Card Info</h3>

      <form className="paymentPageForm" onSubmit={handleSubmit}>
        <div className="paymentFormContainer">
          <div className="iconContainer">
            <FaRegCreditCard size={20} color="#757575" />
          </div>
          <div className="cardNumberContainer">
            <CardNumberElement />
          </div>
        </div>

        <div className="paymentFormContainer">
          <div className="iconContainer">
            <FaRegCalendarAlt size={20} color="#757575" />
          </div>
          <div className="cardNumberContainer">
            <CardExpiryElement />
          </div>
        </div>

        <div className="paymentFormContainer">
          <div className="iconContainer">
            <MdOutlineVpnKey size={20} color="#757575" />
          </div>
          <div className="cardNumberContainer">
            <CardCvcElement />
          </div>
        </div>
        <button style={{ padding: `${loading ? "5px 0" : "10px 5px"}` }}>
          {loading ? <Load /> : `Pay -${orderInfo?.total}`}
        </button>
      </form>
    </>
  );
};

export default Payment;

const Load = () => {
  return <div className="load"></div>;
};
