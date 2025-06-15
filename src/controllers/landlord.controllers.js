import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Room from "../models/Room.models.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
export const submitRoom = asyncHandler(async (req, res) => {
  try {
    const { title, description, location, rent, amenities } = req.body;
    const landlordId = req.user?._id;
    if (!landlordId) {
      throw new ApiError(401, "Unauthorized. Please log in.");
    }

    if (
      !title ||
      !location ||
      !location.address ||
      !location.city ||
      !location.state ||
      !rent
    ) {
      throw new ApiError(400, "Missing required room details.");
    }
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
      location: {
        address: location.address,
        city: location.city,
        state: location.state,
        coordinates: location.coordinates || {},
      },
      rent,
      amenities: amenities || [],
      images: cloudinaryImages,
      landlordId,
      availabilityStatus: "pending",
    });

    const submittedRoom = await newRoom.save();

    res
      .status(201)
      .json(
        new ApiResponse(201, { submittedRoom }, "Room submitted for review")
      );
  } catch (error) {
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
