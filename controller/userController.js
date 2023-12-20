import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
import cloudinary from "cloudinary";

export const register = async (req, res) => {
  try {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    const { name, email, password } = req.body;

    console.log(req.body);

    const user = await userModel.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    const token = user.getJWT();

    res.status(201).cookie("token", token).json({ success: true, user, token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error in register user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Please enter a valid email and password",
      });
    }
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "Please enter a valid email and password",
      });
    }

    const token = user.getJWT();

    res.status(200).cookie("token", token).json({ success: true, user, token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error in login user",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = user.generateResetPasswordToken();

  await user.save();
  res.json({ resetToken });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // 1. Find the user with the provided reset token
  const user = await userModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // 3. Return a success message
  res.json({ message: "Password reset successfully" });
};

export const getUserDetail = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      res.status(401).json({ success: false, message: "user id is invalid" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error in get user detail",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("+password");

    if (!user) {
      res.status(401).json({ success: false, message: "user id is invalid" });
    }

    const isMatch = await user.comparePassword(req.body.oldPassword);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is wrong" });
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password doesn't match" });
    }
    user.password = req.body.newPassword;
    await user.save();

    const token = user.getJWT();

    res
      .status(200)
      .cookie("token", token)
      .json({ success: true, message: "password changed successfully", token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error in change user password",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (req.body.avatar !== "") {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);

      const newAvatar = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      user.avatar = {
        public_id: newAvatar.public_id,
        url: newAvatar.secure_url,
      };
    }

    user.name = req.body.name;
    user.email = req.body.email;

    // Save the updated user
    await user.save();

    // Send a response
    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error in getting all users",
      error: error.message,
    });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user doesn't exist" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error in getting single user",
      error: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
    const user = await userModel.findByIdAndUpdate(req.params.id, newUser, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ success: true, message: "user role updated successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error in updating user role",
      error: error.message,
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user doesn't exist" });
    }

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    await userModel.deleteOne({ _id: user._id });

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error in delete user",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
