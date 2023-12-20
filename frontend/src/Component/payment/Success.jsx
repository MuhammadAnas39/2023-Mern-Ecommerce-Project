import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import "./success.css";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="successPage">
      <div className="successBox">
        <IoCheckmarkCircle size={50} color="coral" />
        <h3>Thank You for ordering!</h3>
        <div>
          <Link to="/orders" className="successViewOrder">
            VIEW ORDERS
          </Link>
          <Link to="/" className="successCShopping">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
