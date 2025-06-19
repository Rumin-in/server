import Room from "../models/Room.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Interest from "../models/Interest.models.js";
import Issue from "../models/Issue.models.js";
import Enquiry from "../models/Enquiries.models.js";
import Referral from "../models/Referral.models.js";

export const expressInterest = asyncHandler(async (req, res) => {
  const roomId = req.params.id;
  const { userId, interestType, notes } = req.body;

  if (!userId || !["visit", "book"].includes(interestType)) {
    throw new ApiError(400, "Invalid user ID or interest type.");
  }

  const room = await Room.findById(roomId);
  if (!room) throw new ApiError(404, "Room not found.");

  // Check if interest already exists
  const existingInterest = await Interest.findOne({
    userId,
    roomId,
    type: interestType,
  });

  if (existingInterest) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Interest already recorded."));
  }

  // Create new interest
  const interest = await Interest.create({
    userId,
    roomId,
    type: interestType,
    notes: notes || "",
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, { interest }, "Interest recorded successfully.")
    );
});

export const enquire = asyncHandler(async (req, res) => {
  try {
    const { name, email, mobileNo, subject, message } = req.body;
    if (!name || !mobileNo || !message) {
      throw new ApiError(400, "All fields are required.");
    }
    const enquiry = await Enquiry.create({
      name,
      email,
      mobileNo,
      subject: subject || "",
      message,
    });

    if (!enquiry) {
      throw new ApiError(500, "Failed to create enquiry.");
    }

    await enquiry.save();
    res
      .status(201)
      .json(new ApiResponse(201, enquiry, "Enquiry created successfully."));
  } catch (error) {
    console.error("Error in enquire:", error);
    res.status(500).json(new ApiError(500, "Internal server error."));
  }
});

export const addBookmarks = asyncHandler(async (req, res) => {
  try {
    const roomId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      throw new ApiError(400, "User ID is required.");
    }

    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError(404, "Room not found.");
    }

    room.bookmarks = room.bookmarks || [];
    const alreadyBookmarked = room.bookmarks.includes(userId);
    if (alreadyBookmarked) {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Room already bookmarked."));
    }
    room.bookmarks.push(userId);
    await room.save();
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Room bookmarked successfully."));
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json(new ApiError(500, "Internal server error."));
  }
});

export const removeBookmark = asyncHandler(async (req, res) => {
  try {
    const roomId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      throw new ApiError(400, "User ID is required.");
    }

    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError(404, "Room not found.");
    }

    room.bookmarks = room.bookmarks || [];
    const bookmarkIndex = room.bookmarks.indexOf(userId);
    if (bookmarkIndex === -1) {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Bookmark not found."));
    }

    room.bookmarks.splice(bookmarkIndex, 1);
    await room.save();

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Bookmark removed successfully."));
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json(new ApiError(500, "Internal server error."));
  }
});

export const getBookmarks = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new ApiError(400, "User ID is required.");
    }

    const rooms = await Room.find({ bookmarks: userId });
    if (!rooms || rooms.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "No bookmarked rooms found."));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, rooms, "Bookmarked rooms retrieved successfully.")
      );
  } catch (error) {
    console.error("Error retrieving bookmarks:", error);
    res.status(500).json(new ApiError(500, "Internal server error."));
  }
});

export const reportIssue = asyncHandler(async (req, res) => {
  try {
    const { roomId, userId, issueDescription } = req.body;

    if (!roomId || !userId || !issueDescription) {
      throw new ApiError(
        400,
        "Room ID, User ID, and issue description are required."
      );
    }

    const issue = await Issue.create({
      roomId,
      userId,
      issueDescription,
    });

    if (!issue) {
      throw new ApiError(500, "Failed to report the issue.");
    }

    await issue.save();

    res
      .status(200)
      .json(new ApiResponse(200, issue, "Issue reported successfully."));
  } catch (error) {
    console.error("Error reporting issue:", error);
    res.status(500).json(new ApiError(500, "Internal server error."));
  }
});

export const referRoom = asyncHandler(async (req, res) => {
  try {
    const {
      referrerId,
      landlordName,
      landlordMobileNo,
      location,
      rent,
      amenities,
      images,
    } = req.body;

    if (!referrerId || !landlordName || !landlordMobileNo || !location) {
      throw new ApiError(400, "All fields are required.");
    }

    const referral = await Referral.create({
      referrer: referrerId,
      landlordName,
      landlordMobileNo,
      location,
      rent,
      amenities: amenities || [],
      images: images || [],
    });

    if (!referral) {
      throw new ApiError(500, "Failed to create referral.");
    }

    await referral.save();
    res
      .status(201)
      .json(new ApiResponse(201, referral, "Referral created successfully."));
  } catch (error) {
    console.error("Error in referRoom:", error);
    res.status(500).json(new ApiError(500, "Internal server error."));
  }
});

export const getNearByRooms = asyncHandler(async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.body;
    console.log(
      "Latitude:",
      lat,
      "Longitude:",
      lng,
      "Max Distance:",
      maxDistance
    );

    if (!lat || !lng) {
      throw new ApiError(400, "Latitude and longitude are required.");
    }

    const nearbyRooms = await Room.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, nearbyRooms, "Nearby rooms fetched successfully.")
      );
  } catch (error) {
    console.error("Error fetching nearby rooms:", error);
    throw new ApiError(500, "Failed to fetch nearby rooms.");
  }
});
