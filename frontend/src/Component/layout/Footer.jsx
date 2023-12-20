import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";
import { FaGithub, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer">
      <div className="first">
        <h4>You can use out app or website</h4>
      </div>
      <div className="mid">
        <h4>Ecommerce</h4>
        <p>Alright copyright researved </p>
      </div>
      <div className="last">
        <h4>Follow Us</h4>

        <a href="https://www.facebook.com/anas.nizamani.39/">
          <FaFacebook />
          <p>Facebook</p>
        </a>
        <a href="https://github.com/MuhammadAnas39">
          <FaGithub />
          <p>Github</p>
        </a>
      </div>
    </div>
  );
};

export default Footer;
