import React from "react";
import { Link } from "react-router-dom";
import "./pageNotFound.css";

const PageNotFound = () => {
  return (
    <div className="pageNotFoundPage">
      <h2>404</h2>
      <h1>Page Not Found</h1>
      <p>You can search for the page you want or return to the homepage.</p>
      <Link to="/">Go Home</Link>
    </div>
  );
};

export default PageNotFound;
