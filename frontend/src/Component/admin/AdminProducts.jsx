import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import {
  clearError,
  deleteAdminProduct,
  getAdminProducts,
} from "../../redux/productSlice";
import { MdEditDocument, MdDelete } from "react-icons/md";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { loading, products, error, isDeleted } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    // Dispatch an action to fetch product data
    dispatch(getAdminProducts());

    // Clean up error on unmount or when the component is re-rendered
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  //   if (loading) {
  //     return <Loader />;
  //   }

  if (error) {
    toast.error(error);
    return null; // You may want to handle errors appropriately
  }

  const rows = [];

  products?.forEach((product) => {
    rows.push({
      id: product._id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      // Add more properties as needed
    });
  });

  async function handleDelete(id) {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!userConfirmed) {
      // User clicked "Cancel," do not proceed further
      return;
    }
    await dispatch(deleteAdminProduct(id));
    toast.success("Product deleted successfully");
    dispatch(getAdminProducts());

    if (isDeleted) {
      toast.success(`Product deleted successfully`);
    }
  }
  //   function handleEdit() {}
  const columns = [
    { field: "id", headerName: "ID", minWidth: 220, flex: 1, sortable: false },
    { field: "name", headerName: "Name", minWidth: 300, flex: 1 },
    {
      field: "price",
      headerName: "Price",
      minWidth: 120,
      flex: 0.3,
    },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 120,
      flex: 0.3,
      type: "number",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 0.3,
      sortable: false,
      type: "number",
      renderCell: (params) => (
        <div>
          <Link to={`/admin/product/${params.row.id}`}>
            <MdEditDocument size={20} color="#767676" />
          </Link>

          <MdDelete
            size={20}
            onClick={() => handleDelete(params.row.id)}
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
          <h2>All Products</h2>
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

export default AdminProducts;
