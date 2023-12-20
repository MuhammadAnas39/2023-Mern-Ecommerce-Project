import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../../redux/productSlice";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import { toast } from "react-toastify";
import "./productDetail.css";
import Rating from "react-rating-stars-component";
import Loader from "../layout/Loader";
import ReviewCard from "./ReviewCard";
import { addItem } from "../../redux/cartSlice";
import NewReview from "../review/NewReview";
import { clearError } from "../../redux/newReview";

const ProductDetail = () => {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const { product, loading, error } = useSelector((state) => state.products);
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );
  const [open, setOpen] = useState(false);

  const options = {
    count: 5,
    value: product?.totalRating,
    size: 24,
    activeColor: "#ff7f50",
    inactiveColor: "#cecece",
    edit: false,
    isHalf: true,
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    dispatch(fetchProductDetails(params.id));

    if (success) {
      toast.success("Review submitted successfully");
    }
    if (reviewError) {
      toast.error(reviewError.message);
    }

    dispatch(clearError());

    window.scrollTo(0, 0);
  }, [dispatch, params, error, success, reviewError]);

  function increaseQuantity() {
    if (quantity >= product?.stock) return;

    setQuantity(quantity + 1);
  }
  function decreaseQuantity() {
    if (quantity > 1) setQuantity(quantity - 1);
  }

  function addToCart() {
    const newItem = {
      product: product?._id,
      image: product?.images[0].url,
      name: product?.name,
      price: product?.price,
      quantity: quantity,
      stock: product?.stock,
    };

    dispatch(addItem(newItem));
    toast.success("Item added to cart");
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="productDetail">
            <div className="firstChild">
              <Carousel className="carousel">
                {product?.images?.map((image, index) => (
                  <Paper key={index} className="carouselItem">
                    <img
                      src={image.url}
                      alt={`carousel-${index}`}
                      className="carouselImg"
                    />
                  </Paper>
                ))}
              </Carousel>
            </div>

            <div className="detailBlog">
              <div className="blog1">
                <h4>{product?.name}</h4>
                <span>Product #{product?._id}</span>
              </div>
              <div className="blog2">
                <Rating {...options} />
                <span>{`(${product?.numOfReviews} Reviews)`}</span>
              </div>
              <div className="blog3">
                <h1>{`$${product?.price}`}</h1>
              </div>
              <div className="blog4">
                <button className="qty" onClick={decreaseQuantity}>
                  -
                </button>
                <input type="text" readOnly value={quantity} />
                <button className="qty" onClick={increaseQuantity}>
                  +
                </button>
                <button
                  disabled={product?.stock < 1 ? true : false}
                  onClick={addToCart}
                  className="addCart"
                >
                  Add to cart
                </button>
              </div>

              <div className="blog5">
                <div className="first">
                  <p>
                    Status:{" "}
                    <b className={`${product?.stock < 1 ? "red" : "green"}`}>
                      {product?.stock < 1 ? "OutOfStock" : "InStock"}
                    </b>
                  </p>
                </div>
                <div className="second">
                  Description:
                  <p>{product?.description}</p>
                </div>
              </div>
              <button onClick={() => setOpen(true)} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>
          <NewReview isOpen={open} onClose={setOpen} id={params.id} />

          <h3 className="reviewHeading">REVIEWS</h3>

          {product?.reviews && product?.reviews?.[0] ? (
            <div className="reviews">
              {product?.reviews &&
                product?.reviews?.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReview">No Reviews Yet</p>
          )}
        </>
      )}
    </>
  );
};

export default ProductDetail;
