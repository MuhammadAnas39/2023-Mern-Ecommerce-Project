import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./newProduct.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearAdminUserErrors,
  getUserDetail,
  updateUserRole,
} from "../../redux/userSlice";
import { CgProfile } from "react-icons/cg";
import { MdOutlineMail } from "react-icons/md";
import "./updateUserRole.css";

const UpdateUserRole = () => {
  const dispatch = useDispatch();
  const { loading, error, isUpdated, user } = useSelector(
    (state) => state.adminUser
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user._id !== id) {
      dispatch(getUserDetail(id));
    }

    if (user && user._id === id) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [dispatch, id, user]);

  if (error) {
    toast.error("User not found");
    dispatch(clearAdminUserErrors());

    return null;
  }
  if (!user) {
    return null;
  }
  if (isUpdated) {
    toast.success("User Updated Successfully");
    dispatch(clearAdminUserErrors());
    navigate("/admin/users");
  }

  const handleUpdateUser = (e) => {
    e.preventDefault();
    console.log("fasdfs");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);
    dispatch(updateUserRole({ id, formData }));
  };

  return (
    <div className="dashboard">
      <Sidebar />

      {loading ? (
        <Loader />
      ) : (
        <div className="updateUserContainer">
          <h2>Update User</h2>
          <form className="newProduct-form" onSubmit={handleUpdateUser}>
            <div className="newProductInputBox">
              <CgProfile size={20} color="#757575" />
              <input
                className="updateUserRoleDisableInputs"
                type="text"
                placeholder="Name"
                value={name}
                disabled
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="newProductInputBox">
              <MdOutlineMail size={20} color="#757575" />
              <input
                className="updateUserRoleDisableInputs"
                disabled
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="newProductInputBox">
              <select
                className="updateUserRoleSelect"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              >
                <option value="">Choose Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <button
              disabled={role === ""}
              className="updateUserBtn"
              type="submit"
            >
              Update
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateUserRole;
