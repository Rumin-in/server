import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Room from "../models/Room.models.js";

export const getLandlordRooms = asyncHandler(async (req, res) => {
  try {
    const landlordId = req.user?._id;
    if (!landlordId) throw new ApiError(401, "Unauthorized. Please log in.");

    const rooms = await Room.find({ landlordId }).sort({ createdAt: -1 });

    res.status(200).json(
      new ApiResponse(200, { rooms }, "Landlord rooms fetched successfully.")
    );
  } catch (error) {
    console.error("Get landlord rooms error:", error);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Failed to fetch landlord rooms"
        )
      );
  }
});

export const submitRoom = asyncHandler(async (req, res) => {
  try {
    let {
      title,
      description,
      address,
      city,
      state,
      latitude,
      longitude,
      rent,
      amenities,
      availabiltyDate,
      bhk,
    } = req.body;

    const landlordId = req.user?._id;
    if (!landlordId) throw new ApiError(401, "Unauthorized. Please log in.");

    // Sanitize/parse
    title = title?.trim();
    description = description?.trim();
    rent = Number(rent);
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    availabiltyDate = availabiltyDate?.trim();
    amenities =
      typeof amenities === "string" ? JSON.parse(amenities.trim()) : amenities;

    if (
      !title ||
      !address ||
      !city ||
      !state ||
      isNaN(latitude) ||
      isNaN(longitude) ||
      !rent
    ) {
      throw new ApiError(400, "Missing required room details.");
    }

    const location = {
      address,
      city,
      state,
      coordinates: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    };

    const cloudinaryImages = [];
    if (!req.files || req.files.length === 0) {
      throw new ApiError(
        400,
        "No images provided. Please upload at least one image."
      );
    }

    for (const file of req.files) {
      if (!file?.path) {
        throw new ApiError(400, "Invalid image file.");
      }
      cloudinaryImages.push(file.path);
    }

    const newRoom = new Room({
      title,
      description: description || "",
      location,
      rent,
      bhk: bhk || "",
      amenities: amenities || [],
      images: cloudinaryImages,
      landlordId,
      availabilityStatus: "pending",
      availabiltyDate: availabiltyDate || Date.now(),
    });

    const submittedRoom = await newRoom.save();

    res
      .status(201)
      .json(
        new ApiResponse(201, { submittedRoom }, "Room submitted for review")
      );
  } catch (error) {
    console.error("Submit room error:", error);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Failed to submit room"
        )
      );
  }
});
