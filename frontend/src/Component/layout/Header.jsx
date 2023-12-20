import React, { useState } from "react";
import {
  AiFillCloseCircle,
  AiOutlineMenu,
  AiOutlineProfile,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import "./header.css";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [isMenuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen(!isMenuOpen);
  }

  return (
    <div className="navbar">
      {isMenuOpen ? (
        <AiFillCloseCircle
          size={30}
          style={isMenuOpen && { position: "fixed" }}
          onClick={toggleMenu}
          className="menu-icon"
        />
      ) : (
        <AiOutlineMenu
          style={isMenuOpen && { position: "fixed" }}
          size={30}
          onClick={toggleMenu}
          className="menu-icon"
        />
      )}

      <div className={`main ${isMenuOpen ? "abc" : ""}`}>
        {isMenuOpen && (
          <>
            <div className="menu">
              <img className="logo" src={logo} alt="logo" />
              <Link onClick={() => setMenuOpen(false)} className="link" to="/">
                {" "}
                Home
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                className="link"
                to="/products"
              >
                {" "}
                Products
              </Link>
            </div>
            <div className="menu">
              <Link
                onClick={() => setMenuOpen(false)}
                className="link"
                to="/about"
              >
                {" "}
                About
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                className="link"
                to="/contact"
              >
                {" "}
                Contact
              </Link>
            </div>
            <div className="icons">
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                <AiOutlineShoppingCart
                  color="#757575"
                  style={{ marginRight: "10px" }}
                  size={30}
                />
              </Link>

              {isAuthenticated ? (
                <>
                  <Link onClick={() => setMenuOpen(false)} to="/account">
                    <CgProfile size={30} color="#757575" />
                  </Link>
                </>
              ) : (
                <>
                  {" "}
                  <Link onClick={() => setMenuOpen(false)} to="/login">
                    <AiOutlineProfile size={30} color="#757575" />
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
