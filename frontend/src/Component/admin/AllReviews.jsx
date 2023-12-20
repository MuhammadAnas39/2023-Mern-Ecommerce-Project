import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import {
  clearReviewsErrors,
  deleteProductReview,
  getProductReviews,
} from "../../redux/productSlice";
import { FaStar } from "react-icons/fa";
import "./allReviews.css";

const AllReviews = () => {
  const dispatch = useDispatch();
  const [productId, setProductId] = useState("");
  const { loading, reviews, error, isDeleted } = useSelector(
    (state) => state.reviews
  );

  const saveProdID = productId;

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getProductReviews(productId));
    }
  }, [productId, dispatch, isDeleted]);

  if (error) {
    toast.error(error.message);
    dispatch(clearReviewsErrors());
    return null; // You may want to handle errors appropriately
  }

  const rows = [];

  reviews?.forEach((review) => {
    rows.push({
      id: review?._id,
      name: review?.name,
      comment: review?.comment,
      rating: review?.rating,
    });
  });

  async function handleDeleteProductReview(reviewId) {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!userConfirmed) {
      return;
    }
    dispatch(deleteProductReview({ saveProdID, reviewId }));
  }
  const columns = [
    { field: "id", headerName: "Review ID", flex: 1, minWidth: 250 },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
      minWidth: 200,
    },
    {
      field: "comment",
      headerName: "Comment",
      flex: 1,
      minWidth: 350,
    },
    {
      field: "rating",
      type: "number",
      headerName: "Rating",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <div
          style={{
            color: params.row.rating >= 3 ? "green" : "red",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "action",
      type: "number",
      sortable: false,
      headerName: "Action",
      flex: 0.3,
      minWidth: 100,
      disableColumnMenu: true,
      renderCell: (params) => (
        <MdDelete
          size={20}
          onClick={() => handleDeleteProductReview(params.row.id)}
          color="coral"
          cursor="pointer"
        />
      ),
    },
  ];

  return (
    <div className="dashboard">
      <Sidebar />
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboardContainer">
          <h2>All Users</h2>
          <div className="allReviewsInputBox">
            <FaStar color="coral" />
            <input
              type="text"
              value={productId}
              placeholder="Product ID"
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>
          {reviews?.length > 0 ? (
            <DataGrid
              disableColumnMenu
              autoHeight
              disableRowSelectionOnClick
              rows={rows}
              columns={columns}
              pageSize={10}
            />
          ) : (
            <h2>No Review Found</h2>
          )}
        </div>
      )}
    </div>
  );
};

export default AllReviews;
