import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { clearError, myOrders } from "../../redux/orderSlice";
import { toast } from "react-toastify";
import "./myOrders.css";
import Loader from "../layout/Loader";
import { AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const { orders, loading, error } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    dispatch(clearError);
    dispatch(myOrders());
  }, [error, dispatch]);

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

  // Column definitions
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
      flex: 0.3,
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to={`/order/${params.row.id}`}>
            <AiFillEye size={20} color="##898989" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="myOrderPage">
          <DataGrid
            className="orderTable"
            rows={rows}
            columns={columns}
            pageSize={5}
            disableRowSelectionOnClick
            disableDensitySelector
            disableEval
            disableVirtualization
          />
          <p>{user?.name}'s' Orders</p>
        </div>
      )}
    </>
  );
};

export default MyOrders;
