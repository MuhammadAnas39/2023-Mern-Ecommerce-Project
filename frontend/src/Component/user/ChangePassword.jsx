import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import { changePassword } from "../../redux/profileSlice";
import "./changePassword.css";
import { MdOutlineVpnKey } from "react-icons/md";

const ChangePassword = ({
  isChangePasswordModal,
  setIsChangePasswordModal,
}) => {
  const dispatch = useDispatch();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);

    dispatch(changePassword(formData));
  };
  return (
    <>
      {isChangePasswordModal && (
        <div
          className={`modal-overlay ${isChangePasswordModal ? "active" : ""}`}
          onClick={() => setIsChangePasswordModal(false)}
        >
          <div
            className={`modal-content ${isChangePasswordModal ? "active" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setIsChangePasswordModal(false)}
            >
              &times;
            </button>

            <h2 className="changePasswordHeading">Change Password</h2>
            <form
              className="changePassword-form"
              onSubmit={handleChangePassword}
            >
              <div className="changePasswordInputBox">
                <MdOutlineVpnKey size={20} color="#757575" />
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className="changePasswordInputBox">
                <AiOutlineUnlock size={20} color="#757575" />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="changePasswordInputBox">
                <AiOutlineLock size={20} color="#757575" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button className="changePasswordSubmit" type="submit">
                Change
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
