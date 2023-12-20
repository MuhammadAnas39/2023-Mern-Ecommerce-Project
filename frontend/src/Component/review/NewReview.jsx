import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Rating from "react-rating-stars-component";
import "./newReview.css";
import { createReview } from "../../redux/newReview";
import { toast } from "react-toastify";

const NewReview = ({ isOpen, onClose, id }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { product } = useSelector((state) => state.products);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = async (e) => {
    e.preventDefault();
    if (user) {
      const reviewData = new FormData();
      reviewData.append("rating", rating);
      reviewData.append("comment", comment);

      dispatch(createReview({ id, reviewData }));
      onClose(false);
    } else {
      toast.error("Login to add to review");
    }
  };

  useEffect(() => {
    if (product?.reviews && user) {
      const existingReview = product.reviews.find(
        (review) => review.user === user._id
      );

      if (existingReview) {
        setRating(existingReview.rating);
        setComment(existingReview.comment);
      }
    }
  }, [product, user]);
  return (
    <>
      {isOpen && (
        <div
          className={`modal-overlay ${isOpen ? "active" : ""}`}
          onClick={() => onClose(false)}
        >
          <div
            className={`modal-content ${isOpen ? "active" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => onClose(false)}>
              &times;
            </button>
            <button className="modal-close" onClick={() => onClose(false)}>
              &times;
            </button>

            <h2 className="reviewModalHeading">Review</h2>
            <form className="reviewModal-form" onSubmit={submitReview}>
              <Rating
                count={5}
                onChange={(newRating) => setRating(newRating)}
                size={24}
                activeColor="coral"
                inactiveColor="#cecece"
                value={rating}
              />
              <textarea
                rows={4}
                cols={3}
                placeholder="Type review..."
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />

              <div>
                <button
                  className="reviewModalSubmit"
                  type="button"
                  onClick={() => onClose(false)}
                >
                  Cancel
                </button>
                <button className="reviewModalSubmit" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewReview;
