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
    
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if user already exists with this email
    const existingUserByEmail = await User.findOne({ email: normalizedEmail });
    if (existingUserByEmail) {
      throw new ApiError(400, "User already exists with this email.");
    }
    
    // Check if user already exists with this mobile number (if provided)
    if (mobileNo) {
      const existingUserByMobile = await User.findOne({ mobileNo: mobileNo });
      if (existingUserByMobile) {
        throw new ApiError(400, "User already exists with this mobile number.");
      }
    }

    // Create new user
    const userData = {
      name,
      email: normalizedEmail,
      password,
      role,
    };
    
    // Only add mobileNo if it's provided and not empty
    if (mobileNo && mobileNo.trim()) {
      userData.mobileNo = mobileNo.trim();
    }
    
    const user = new User(userData);
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

    // Normalize email to lowercase if provided
    const normalizedEmail = email ? email.toLowerCase().trim() : null;

    // Find user by email or mobile number
    const user = await User.findOne({
      $or: [
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(mobileNo ? [{ mobileNo: mobileNo }] : [])
      ],
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



export const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId; // from auth middleware or request
    const { name, email, mobileNo, password } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Prepare update data object only with valid, non-empty values
    const updateData = {};

    if (name && name.trim() && name !== user.name) {
      updateData.name = name.trim();
    }

    if (email && email.trim().toLowerCase() !== user.email) {
      const normalizedEmail = email.toLowerCase().trim();

      // Check if new email already exists
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        throw new ApiError(400, "Email already in use by another account");
      }

      updateData.email = normalizedEmail;
    }

    if (mobileNo && mobileNo.trim() !== user.mobileNo) {
      const existingMobile = await User.findOne({ mobileNo: mobileNo.trim() });
      if (existingMobile && existingMobile._id.toString() !== userId.toString()) {
        throw new ApiError(400, "Mobile number already in use by another account");
      }

      updateData.mobileNo = mobileNo.trim();
    }

    if (password && password.trim()) {
      updateData.password = password;
    }

    // Handle profile picture upload from multer
    if (req.file && req.file.path) {
      updateData.profilePicture = req.file.path;
    }

    // If no data to update
    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "No valid fields provided for update");
    }

    // Update user
    Object.assign(user, updateData);
    await user.save();

    res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
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
