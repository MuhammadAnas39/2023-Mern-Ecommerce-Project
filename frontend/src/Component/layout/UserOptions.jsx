import React, { useState } from "react";
import { AiOutlineOrderedList, AiOutlineShopping } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { IoLogOutSharp } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdDashboard } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import "./userOptions.css";
import { useNavigate } from "react-router-dom";
import image from "../../images/img.png";
import { logout } from "../../redux/userSlice";

const UserOptions = () => {
  const { items } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const options = [
    { icon: <AiOutlineOrderedList />, title: "Orders", func: orders },
    { icon: <CgProfile />, title: "Profile", func: account },
    {
      icon: <AiOutlineShopping />,
      title: `Cart ${items?.length}`,
      func: cart,
    },
    { icon: <IoLogOutSharp />, title: "Logout", func: logoutUser },
  ];

  if (user?.role === "admin") {
    options.unshift({
      icon: <MdDashboard />,
      title: "Dashboard",
      func: dashboard,
    });
  }

  function dashboard() {
    navigate("/admin/dashboard");
    setOpen(false);
  }
  function orders() {
    navigate("/orders");
    setOpen(false);
  }
  function account() {
    navigate("/account");
    setOpen(false);
  }
  function cart() {
    navigate("/cart");
    setOpen(false);
  }
  function logoutUser() {
    setOpen(false);
    dispatch(logout());
  }

  return (
    <>
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}
      {isAuthenticated && (
        <div className="profileBox">
          <img
            src={user?.avatar?.url ? user?.avatar?.url : image}
            alt="profilePicture"
          />
          <IoMdArrowDropdown
            onClick={() => setOpen(!open)}
            size={20}
            className={open ? "active" : ""}
          />
          {open && (
            <div className={`dropDownBox ${open ? "active" : ""}`}>
              {options.map((item) => (
                <div key={item.title} onClick={item.func}>
                  {item.icon}
                  {item.title}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserOptions;
