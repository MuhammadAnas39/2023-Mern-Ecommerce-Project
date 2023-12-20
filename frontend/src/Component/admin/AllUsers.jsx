import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import { MdEditDocument, MdDelete } from "react-icons/md";
import {
  clearAdminUserErrors,
  deleteUser,
  getAllUsers,
} from "../../redux/userSlice";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { loading, users, error, isDeleted, message } = useSelector(
    (state) => state.adminUser
  );

  useEffect(() => {
    dispatch(getAllUsers());

    if (isDeleted) {
      toast.success(message);
    }
    // Clean up error on unmount or when the component is re-rendered
    return () => {
      dispatch(clearAdminUserErrors());
    };
  }, [dispatch, isDeleted, message]);

  //   if (loading) {
  //     return <Loader />;
  //   }

  if (error) {
    toast.error(error.message);
    dispatch(clearAdminUserErrors());
    return null; // You may want to handle errors appropriately
  }

  const rows = [];

  users?.forEach((user) => {
    rows.push({
      id: user?._id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
    });
  });

  async function handleDeleteUser(id) {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!userConfirmed) {
      // User clicked "Cancel," do not proceed further
      return;
    }
    dispatch(deleteUser(id));
  }
  //   function handleEdit() {}
  const columns = [
    { field: "id", headerName: "User ID", flex: 1, minWidth: 250 },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
      minWidth: 150,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.8,
      minWidth: 200,
    },
    {
      field: "role",
      type: "number",
      headerName: "Role",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <div
          style={{
            color: params.row.role === "admin" ? "green" : "red",
          }}
        >
          {params.value}
        </div>
      ),
      //   align: "right", // Align the header text to the right
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
        <div>
          <Link to={`/admin/user/${params.row.id}`}>
            <MdEditDocument size={20} color="#767676" />
          </Link>

          <MdDelete
            size={20}
            onClick={() => handleDeleteUser(params.row.id)}
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
          <h2>All Users</h2>
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

export default AllUsers;
