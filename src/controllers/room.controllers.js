import Room from "../models/Room.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllRooms = asyncHandler(async (req, res) => {
  try {
    const { location, rentRange, amenities, availability } = req.query;

    const query = {};

    if (location) query.location = { $regex: location, $options: "i" };

    if (rentRange) {
      const [min, max] = rentRange.split("-").map(Number);
      query.rent = { $gte: min, $lte: max };
    }

    if (amenities) {
      const amenitiesArray = amenities.split(",");
      query.amenities = { $all: amenitiesArray };
    }

    query.availabilityStatus = "available";

    const rooms = await Room.find(query);
    res.status(200).json(new ApiResponse(200, { rooms }, "Rooms fetched"));
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

export const getRoomById = asyncHandler(async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId).populate(
      "landlordId",
      "name email mobileNo"
    );
    if (!room) {
      return res.status(404).json(new ApiResponse(404, null, "Room not found"));
    }
    room.viewsCount += 1;
    await room.save();
    res
      .status(200)
      .json(new ApiResponse(200, { room }, "Room details fetched"));
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
