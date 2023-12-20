import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import { MdEditDocument, MdDelete } from "react-icons/md";
import {
  clearDeleteOrderErrors,
  clearError,
  deleteOrder,
  getAllOrders,
} from "../../redux/orderSlice";

const AllOrders = () => {
  const dispatch = useDispatch();
  const { loading, orders, error } = useSelector((state) => state.allOrders);
  const { isDeleted, error: deleteError } = useSelector(
    (state) => state.deleteOrder
  );

  useEffect(() => {
    // Dispatch an action to fetch product data
    dispatch(getAllOrders());

    if (isDeleted) {
      toast.success("Order deleted successfully");
      dispatch(clearDeleteOrderErrors());
    }
    // Clean up error on unmount or when the component is re-rendered
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, isDeleted]);

  //   if (loading) {
  //     return <Loader />;
  //   }

  if (error) {
    toast.error(error);
    return null; // You may want to handle errors appropriately
  }
  if (deleteError) {
    toast.error(deleteError);
    return null; // You may want to handle errors appropriately
  }

  const rows = [];

  orders?.forEach((order) => {
    rows.push({
      id: order?._id,
      product: order?.product,
      status: order?.orderStatus,
      itemsQty: order?.orderItems?.length,
      amount: order?.totalPrice,
    });
  });

  async function handleDeleteOrder(id) {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!userConfirmed) {
      // User clicked "Cancel," do not proceed further
      return;
    }
    dispatch(deleteOrder(id));
    // dispatch(getAdminProducts());
  }
  //   function handleEdit() {}
  const columns = [
    { field: "id", headerName: "Order ID", flex: 1, minWidth: 250 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      minWidth: 150,
      renderCell: (params) => (
        <div
          style={{
            color: params.row.status === "Delivered" ? "green" : "red",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      flex: 0.5,
      minWidth: 150,
    },
    {
      field: "amount",
      type: "number",
      headerName: "Amount",
      flex: 0.5,
      minWidth: 150,
      //   align: "right", // Align the header text to the right
    },
    {
      field: "action",
      type: "number",
      sortable: false,
      headerName: "Action",
      flex: 0.3,
      minWidth: 150,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div>
          <Link to={`/admin/order/${params.row.id}`}>
            <MdEditDocument size={20} color="#767676" />
          </Link>

          <MdDelete
            size={20}
            onClick={() => handleDeleteOrder(params.row.id)}
            color="coral"
            cursor="pointer"
          />
        </div>
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
          <h2>All Orders</h2>
          <DataGrid
            disableColumnMenu
            autoHeight
            disableRowSelectionOnClick
            rows={rows}
            columns={columns}
            pageSize={10}
          />
        </div>
      )}
    </div>
  );
};

export default AllOrders;
