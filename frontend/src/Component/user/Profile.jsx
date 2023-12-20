import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Profile.css";
import EditModal from "./EditModal";
import Loader from "../layout/Loader";
import ChangePassword from "./ChangePassword";
import { toast } from "react-toastify";
import { clearError } from "../../redux/profileSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading, error, isUpdated } = useSelector((state) => state.profile);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    if (isUpdated) {
      toast.success(isUpdated);
    }
    dispatch(clearError());
  }, [error, isUpdated, dispatch]);

  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [isChangePasswordModal, setIsChangePasswordModal] = useState(false);

  function closeEditProfileModal() {
    setEditProfileModalOpen(false);
  }
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <div className="accountBox">
            <div className="profileFirst">
              <h2>My Profile</h2>
              <img src={user?.avatar?.url} alt="profile" />
              <button onClick={() => setEditProfileModalOpen(true)}>
                Edit Profile
              </button>
            </div>
            <div className="profileSecond">
              <div>
                <h4>Full Name</h4>
                <p>{user?.name}</p>
              </div>

              <div>
                <h4>Email</h4>
                <p>{user?.email}</p>
              </div>

              <div>
                <h4>Joined On</h4>
                <p>{user?.createdAt.substring(0, 10)}</p>
              </div>

              <div>
                <button
                  onClick={() => navigate("/orders")}
                  className="accountBtn"
                >
                  My Orders
                </button>
                <button
                  onClick={() => setIsChangePasswordModal(true)}
                  className="accountBtn"
                >
                  Change Password
                </button>
              </div>
            </div>

            <EditModal
              isOpen={isEditProfileModalOpen}
              onClose={closeEditProfileModal}
            ></EditModal>

            <ChangePassword
              isChangePasswordModal={isChangePasswordModal}
              setIsChangePasswordModal={setIsChangePasswordModal}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
