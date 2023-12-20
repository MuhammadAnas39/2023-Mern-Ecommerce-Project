import React from "react";
import Rating from "react-rating-stars-component";

const profileImg =
  "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";

const ReviewCard = ({ review }) => {
  const options = {
    count: 5,
    value: review?.rating,
    size: 24,
    activeColor: "#ff7f50",
    inactiveColor: "#cecece",
    edit: false,
    isHalf: true,
  };
  //   console.log(review);
  return (
    <div className="reviewCard">
      <img src={profileImg} alt="" />
      <p>{review?.name}</p>
      <Rating {...options} />
      <span>{review?.comment}</span>
    </div>
  );
};

export default ReviewCard;
