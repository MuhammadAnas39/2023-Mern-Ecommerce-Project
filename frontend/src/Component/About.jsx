import React from "react";
import "./about.css";
import myImage from "../images/me.jpg";

const whatsApp =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/479px-WhatsApp_icon.png";

const email = "https://1000logos.net/wp-content/uploads/2021/05/Gmail-logo.png";

const whatsappNumber = "+923143273497"; // Replace with your WhatsApp number
const emailAddr = "anasnizamani54@gmail.com";

const About = () => {
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const emailLink = `mailto:${emailAddr}`;

  return (
    <div className="about-us-container">
      <div className="image-container">
        <img src={myImage} alt="About Us" />
      </div>
      <div className="details-container">
        <h2>About Us</h2>
        <p>
          Welcome to our platform! We are a dedicated team passionate about
          delivering high-quality services.
        </p>
        <div className="icon-links">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <img src={whatsApp} alt="Upwork" />
          </a>
          <a
            href={emailLink}
            // href="https://www.email.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={email} alt="Email" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
