import React, { useEffect } from "react";
import { clearError, fetchProducts } from "../../redux/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { CgMouse } from "react-icons/cg";
import "./home.css";
import Product from "./ProductCard";
import Loader from "../layout/Loader";
import { toast } from "react-toastify";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    dispatch(fetchProducts({}));
  }, [dispatch, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="home">
            <p>Welcome to Ecommerce</p>
            <h2>FIND AMAZING PRODUCT BELOW</h2>

            <a href="#container">
              <button className="btn">
                Scroll <CgMouse />
              </button>
            </a>
          </div>
          <h3 className="homeHeading">Featured Product</h3>;
          <div className="container" id="container">
            {products?.slice(0, 6).map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
