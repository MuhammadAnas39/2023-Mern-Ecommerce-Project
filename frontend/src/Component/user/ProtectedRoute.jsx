import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../layout/Loader";

function ProtectedRoute({ children, adminOnly }) {
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return; // Wait until loading is complete
    }

    if (isAuthenticated === false) {
      navigate("/login");
      return;
    }

    if (adminOnly && user && user.role !== "admin") {
      navigate("/"); // Redirect non-admins
    }
  }, [isAuthenticated, loading, navigate, adminOnly, user]);

  if (loading) {
    return <Loader />;
  }

  return <>{isAuthenticated && children}</>; // Render children for authenticated users
}

export default ProtectedRoute;
