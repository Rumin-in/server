import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken } from "../config/jwt.js";
import jwt from "jsonwebtoken";
import Admin from "../models/Admins.models.js";

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, mobileNo, password, role } = req.body;
    if(!name || !email || !password){
      throw new ApiError(400, "Name, email, and password are required.");
    }
    // Check if user already exists
    const existingUser = await User.find({
      $or: [{ email: email }, { mobileNo: mobileNo }],
    });
    if (existingUser.length > 0) {
      throw new ApiError(400, "User already exists with this email or mobile number.");
    }

    // Create new user
    const user = new User({
      name,
      email,
      mobileNo,
      password,
      role,
    });
    await user.save();
    res
      .status(201)
      .json(new ApiResponse(201, user, "User registered successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal Server Error"
        )
      );
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password, mobileNo } = req.body;

    // Find user by email
    const user = await User.findOne({
      $or: [{ email: email }, { mobileNo: mobileNo }],
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Generating token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res
      .status(200)
      .json(new ApiResponse(200, { user, accessToken }, "Login successful"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal Server Error"
        )
      );
  }
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) throw new ApiError(401, "No refresh token found");

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) throw new ApiError(403, "Invalid refresh token");

      const accessToken = generateAccessToken(decoded.userId);
      res
        .status(200)
        .json(new ApiResponse(200, { accessToken }, "Token refreshed"));
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal Server Error"
        )
      );
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal Server Error"
        )
      );
  }
});



export const panelRegister = asyncHandler(async (req, res) => {
  try{
    const { name, email, mobileNo, password, role } = req.body;
    if (!name || !email || !password || !role || !mobileNo) {
      throw new ApiError(400, "All fields are required.");
    }

    // Check if user already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Admin or Manager already exists with this email.");
    }

    const passkey =
      role === "admin"
        ? process.env.ADMIN_PASSKEY
        : role === "manager"
        ? process.env.MANAGER_PASSKEY
        : null;

    if (!passkey || password !== passkey) {
      throw new ApiError(401, "Invalid passkey for the specified role.");
    }
    const user = new Admin({
      name,
      email,
      passkey: password,
      role,
      mobileNo
    });
    await user.save();

    res.status(201).json(
      new ApiResponse(201, user, "Admin or Manager registered successfully")
    );
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal Server Error"
        )
      );
  }
});

export const panelLogin = asyncHandler(async (req, res) => {
  try {
    const { email, passkey } = req.body;

    if (!email || !passkey) {
      throw new ApiError(400, "Email and passkey are required.");
    }

    const user = await Admin.findOne({ email });

    if (!user || !["admin", "manager"].includes(user.role)) {
      throw new ApiError(403, "Access restricted to admin or manager only.");
    }

    const isValidPasskey =
      (user.role === "admin" && passkey === process.env.ADMIN_PASSKEY) ||
      (user.role === "manager" && passkey === process.env.MANAGER_PASSKEY);

    if (!isValidPasskey) {
      throw new ApiError(401, "Invalid passkey.");
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json(
      new ApiResponse(200, {
        user,
        accessToken,
      }, "Panel login successful")
    );

  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal Server Error"
        )
      );
  }
});
