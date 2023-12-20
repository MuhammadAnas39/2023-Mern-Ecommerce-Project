import React, { useEffect, useRef, useState } from "react";
import { AiOutlineMail, AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import "./LoginSignup.css";
import image from "../../images/img.png";
import { useDispatch, useSelector } from "react-redux";
import { clearError, login, register } from "../../redux/userSlice";
import Loader from "../layout/Loader";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const [isLogin, setLogin] = useState(true);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/account");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email: loginEmail, password: loginPassword }));
  };

  const handleChange = (e) => {
    if (e?.target?.name === "avatar") {
      const file = e?.target?.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = (event) => {
          setAvatar(event?.target?.result);
        };

        reader.readAsDataURL(file);
      } else {
        // Handle the case where no file is selected
        setAvatar(null);
      }
    } else {
      // Handle non-file input changes
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);

    dispatch(register(formData));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="login-signup-container">
          <div className="loginBox">
            <div className="toggle-buttons">
              <button onClick={() => setLogin(true)}>Login</button>
              <button onClick={() => setLogin(false)}>Register</button>

              <div
                className={`underline ${isLogin ? "login" : "register"}`}
              ></div>
            </div>

            <div className="form-container">
              {isLogin ? (
                <form className="login-form" onSubmit={handleLogin}>
                  <div className="inputBox">
                    <AiOutlineMail size={20} color="#757575" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="inputBox">
                    <AiOutlineLock size={20} color="#757575" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>

                  <button className="submit" type="submit">
                    Login
                  </button>
                </form>
              ) : (
                <form className="register-form" onSubmit={handleRegister}>
                  <div className="inputBox">
                    <AiOutlineUser size={20} color="#757575" />
                    <input
                      type="text"
                      placeholder="Name"
                      value={user.name}
                      onChange={handleChange}
                      name="name"
                    />
                  </div>
                  <div className="inputBox">
                    <AiOutlineMail size={20} color="#757575" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={user.email}
                      onChange={handleChange}
                      name="email"
                    />
                  </div>
                  <div className="inputBox">
                    <AiOutlineLock size={20} color="#757575" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={user.password}
                      onChange={handleChange}
                      name="password"
                    />
                  </div>
                  <div className="inputBox">
                    <img
                      className="fileImg"
                      src={avatar ? avatar : image}
                      alt="Selected"
                    />

                    <label className="chooseFile" htmlFor="file" id="file">
                      Choose Image
                    </label>
                    <input
                      type="file"
                      id="file"
                      name="avatar"
                      ref={fileInputRef}
                      className="hiddenFile"
                      onChange={handleChange}
                      placeholder="Password"
                    />
                  </div>
                  <button className="submit" type="submit">
                    Register
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginSignup;
