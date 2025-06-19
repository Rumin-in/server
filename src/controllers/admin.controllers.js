import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Interest from "../models/Interest.models.js";
import Room from "../models/Room.models.js";
import User from "../models/User.models.js";
import Issue from "../models/Issue.models.js";
import Enquiry from "../models/Enquiries.models.js";
import Referral from "../models/Referral.models.js";
import { deleteFromCloudinary } from "../utils/deleteOnCloudinary.js";
import extractPublicIdFromUrl from "../utils/extractPublicIdFromUrl.js";

export const getAllListings = asyncHandler(async (req, res) => {
  const listings = await Room.find().populate("landlordId", "name email");
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { listings },
        "All room listings fetched successfully."
      )
    );
});

export const approveListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const room = await Room.findById(id);
  if (!room) throw new ApiError(404, "Room not found.");

  room.availabilityStatus = "available";
  await room.save();

  res.status(200).json(new ApiResponse(200, {}, "Room listing approved."));
});

export const rejectListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const room = await Room.findById(id);
  if (!room) throw new ApiError(404, "Room not found.");

  room.availabilityStatus = "rejected";
  await room.save();

  res.status(200).json(new ApiResponse(200, {}, "Room listing rejected."));
});

export const updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedRoomData = req.body;

  const room = await Room.findById(id);
  if (!room) throw new ApiError(404, "Room not found.");

  const previousSnapshot = {
    updatedAt: new Date(),
    data: {
      title: room.title,
      description: room.description,
      location: room.location,
      rent: room.rent,
      amenities: room.amenities,
      images: room.images,
      availabilityStatus: room.availabilityStatus,
      availabiltyDate: room.availabiltyDate,
    },
  };

  room.history = [previousSnapshot, ...(room.history || [])].slice(0, 3);

  Object.keys(updatedRoomData).forEach((key) => {
    room[key] = updatedRoomData[key];
  });

  const updatedRoom = await room.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedRoom },
        "Room listing updated successfully."
      )
    );
});

export const updateImageOfListing = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { action, imageToDelete } = req.body;

    const room = await Room.findById(id);
    if (!room) throw new ApiError(404, "Room not found.");

    const previousSnapshot = {
      updatedAt: new Date(),
      data: {
        images: [...room.images],
      },
    };
    room.history = [previousSnapshot, ...(room.history || [])].slice(0, 3);

    if (action === "add") {
      if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "No image files provided for upload.");
      }
      const newImagePaths = req.files.map((file) => file.path);
      room.images.push(...newImagePaths);
    } else if (action === "delete") {
      if (!imageToDelete || typeof imageToDelete !== "string") {
        throw new ApiError(400, "imageToDelete must be a valid image URL.");
      }

      const publicId = extractPublicIdFromUrl(imageToDelete);
      await deleteFromCloudinary(publicId);

      room.images = room.images.filter((img) => img !== imageToDelete);
    } else {
      throw new ApiError(
        400,
        "Invalid or missing action. Use 'add' or 'delete'."
      );
    }

    await room.save();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { images: room.images },
          "Room images updated successfully."
        )
      );
  } catch (error) {
    console.error("Error updating room images:", error);
    throw new ApiError(
      500,
      "Internal server error while updating room images."
    );
  }
});

export const markAsBooked = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) throw new ApiError(404, "Room not found.");

    room.availabilityStatus = "booked";
    await room.save();

    res.status(200).json(new ApiResponse(200, {}, "Room marked as booked."));
  } catch (error) {
    console.error("Error marking room as booked:", error);
    throw new ApiError(
      500,
      "Internal server error while marking room as booked."
    );
  }
});

export const getAdminAnalytics = asyncHandler(async (req, res) => {
  const totalListings = await Room.countDocuments();
  const approvedListings = await Room.countDocuments({
    availabilityStatus: "available",
  });
  const pendingListings = await Room.countDocuments({
    availabilityStatus: "pending",
  });

  const allRooms = await Room.find({}, "title views");
  const viewsPerListing = allRooms.map((room) => ({
    title: room.title,
    views: room.views || 0,
  }));

  const activeUsersResult = await Interest.distinct("userId");

  const analytics = {
    totalListings,
    approvedListings,
    pendingListings,
    viewsPerListing,
    activeUsers: activeUsersResult.length,
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, analytics, "Admin analytics fetched successfully.")
    );
});

export const addUserBalance = asyncHandler(async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      throw new ApiError(400, "User ID and amount are required.");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    user.walletBalance = (user.walletBalance || 0) + amount;
    await user.save();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { balance: user.walletBalance },
          "User balance updated successfully."
        )
      );
  } catch (error) {
    console.error("Error adding user balance:", error);
    res
      .status(500)
      .json(
        new ApiError(500, "Internal server error while updating user balance.")
      );
  }
});

export const getAllIssues = asyncHandler(async (req, res) => {
  try {
    const issues = await Issue.find();
    res
      .status(200)
      .json(
        new ApiResponse(200, { issues }, "All issues fetched successfully.")
      );
  } catch (error) {
    console.error("Error fetching issues:", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal server error while fetching issues."));
  }
});

export const getAllEnquiries = asyncHandler(async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    if (!enquiries || enquiries.length === 0) {
      return res.status(404).json(new ApiError(404, "No enquiries found."));
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { enquiries },
          "All enquiries fetched successfully."
        )
      );
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res
      .status(500)
      .json(
        new ApiError(500, "Internal server error while fetching enquiries.")
      );
  }
});

export const getAllReferredRooms = asyncHandler(async (req, res) => {
  try {
    const referredRooms = await Referral.find();
    if (!referredRooms || referredRooms.length === 0) {
      return res
        .status(404)
        .json(new ApiError(404, "No referred rooms found."));
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { referredRooms },
          "All referred rooms fetched successfully."
        )
      );
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    res
      .status(500)
      .json(
        new ApiError(
          500,
          "Internal server error while fetching available rooms."
        )
      );
  }
});
