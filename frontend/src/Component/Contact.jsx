import React from "react";
import "./contact.css";
import { MdOutlineMail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

const whatsappNumber = "+923143273497"; // Replace with your WhatsApp number
const emailAddr = "anasnizamani54@gmail.com";

const whatsappLink = `https://wa.me/${whatsappNumber}`;
const emailLink = `mailto:${emailAddr}`;

const Contact = () => {
  return (
    <div className="contactUsPage">
      <a href={emailLink}>
        <div>
          {" "}
          <MdOutlineMail size={35} />
        </div>
        <p>anasnizamani54@gmail.com</p>
      </a>
      <a href={whatsappLink}>
        <div>
          <FaWhatsapp size={35} />
        </div>
        <p>+923143273497</p>
      </a>
    </div>
  );
};

export default Contact;
