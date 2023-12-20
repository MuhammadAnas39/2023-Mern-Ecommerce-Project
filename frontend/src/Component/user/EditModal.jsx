import React, { useEffect, useState } from "react";
import "./editModal.css";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { updateProfile } from "../../redux/profileSlice";
import { loadUser } from "../../redux/userSlice";

const EditModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [oldAvatar, setOldAvatar] = useState("");

  useEffect(() => {
    if (user) {
      setName(user?.name);
      setEmail(user?.email);
      setOldAvatar(user?.avatar?.url || "");
    }
  }, [user]);

  const handleChange = (e) => {
    const file = e?.target?.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setAvatar(event?.target?.result);
      };

      reader.readAsDataURL(file);
    } else {
      setAvatar(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("avatar", avatar);

    await dispatch(updateProfile(formData));
    dispatch(loadUser());
    onClose();
  };
  return (
    <>
      {isOpen && (
        <div
          className={`modal-overlay ${isOpen ? "active" : ""}`}
          onClick={onClose}
        >
          <div
            className={`modal-content ${isOpen ? "active" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose}>
              &times;
            </button>
            <button className="modal-close" onClick={onClose}>
              &times;
            </button>

            <h2 className="updateHeading">Update Profile</h2>
            <form className="update-form" onSubmit={handleUpdate}>
              <div className="updateInputBox">
                <AiOutlineUser size={20} color="#757575" />
                <input
                  type="text"
                  value={name}
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="updateInputBox">
                <AiOutlineMail size={20} color="#757575" />
                <input
                  type="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="updateInputBox">
                <img
                  className="fileImg"
                  src={avatar ? avatar : oldAvatar}
                  alt="Selected"
                />

                <label className="chooseFile" htmlFor="file" id="file">
                  Choose Image
                </label>
                <input
                  type="file"
                  id="file"
                  name="avatar"
                  className="hiddenFile"
                  onChange={handleChange}
                  placeholder="Password"
                />
              </div>
              <button className="updateSubmit" type="submit">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditModal;
