import React, { useEffect } from "react";
import "./orderslider.css";
import { GiConfirmed } from "react-icons/gi";
import { BiDetail } from "react-icons/bi";
import { MdOutlinePayments } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderSlider = ({ stage }) => {
  const navigate = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cart);
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const items = [
    {
      icon: <BiDetail size={20} />,
      title: "Shipping Detail",
      div: <div className="line" />,
      func: () => shipping(),
    },
    {
      icon: <GiConfirmed size={20} />,
      title: "Confirm Order",
      div: <div className="line" />,
      func: () => confirmOrder(),
    },
    {
      icon: <MdOutlinePayments size={21} />,
      title: "Payment",
      func: () => payment(),
    },
  ];

  useEffect(() => {
    if (Object.keys(shippingInfo).length < 1) {
      navigate("/shipping");
    }
  }, [shippingInfo, navigate]);

  function shipping() {
    navigate("/shipping");
  }
  function confirmOrder() {
    if (Object.keys(shippingInfo).length > 0) {
      navigate("/confirmorder");
    } else {
      navigate("/shipping");
    }
  }
  function payment() {
    if (orderInfo) {
      navigate("/payment");
    } else {
      navigate("/confirmorder");
    }
  }

  return (
    <div className="orderSliderContainer">
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            position: "relative",
            width: `${item.div ? "100%" : "auto"}`,
            // gap: "15px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: index <= stage ? "red" : "rgb(170 170 170)",
              cursor: "pointer",
            }}
            onClick={item.func}
          >
            {item.icon}
            <p
              style={{
                fontSize: "12px",
                color: index <= stage ? "red" : "rgb(170 170 170)",
              }}
            >
              {" "}
              {item.title}
            </p>
          </div>
          {item.div && (
            <div
              className="line"
              style={{
                background: index < stage ? "red" : "rgb(170 170 170)",
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderSlider;
