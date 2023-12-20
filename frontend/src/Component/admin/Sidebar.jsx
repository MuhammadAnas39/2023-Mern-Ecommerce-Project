import React, { useState } from "react";
import logo from "../../images/logo.png";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import {
  MdAdd,
  MdDashboard,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdListAlt,
  MdPostAdd,
  MdRateReview,
} from "react-icons/md";
import { FaUsers } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const [isProductOpen, setIsProductOpen] = useState(false);

  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="sidebarlogo" />
      </Link>
      <Link
        to="/admin/dashboard"
        className={location.pathname === "/admin/dashboard" ? "active" : ""}
      >
        <MdDashboard />
        <p>Dashboard</p>
      </Link>
      <div
        className={`sidebar-item ${
          location.pathname === "/admin/products" ||
          location.pathname === "/admin/product"
            ? "active"
            : ""
        }`}
        onClick={() => setIsProductOpen(!isProductOpen)}
      >
        {isProductOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        <p>Product</p>
      </div>
      {isProductOpen && (
        <>
          <div className="sub-item">
            <Link
              to="/admin/products"
              className={
                location.pathname === "/admin/products" ? "active" : ""
              }
            >
              <MdPostAdd />
              <p>All</p>
            </Link>
            <Link to="/admin/product/new">
              <MdAdd />
              <p>Create</p>
            </Link>
          </div>
        </>
      )}
      <Link to="/admin/orders">
        <MdListAlt />
        <p>Orders</p>
      </Link>
      <Link to="/admin/users">
        <FaUsers />
        <p>Users</p>
      </Link>
      <Link to="/admin/review">
        <MdRateReview />
        <p>Reviews</p>
      </Link>
    </div>
  );
};

export default Sidebar;
