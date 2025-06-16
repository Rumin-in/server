import Room from "../models/Room.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllListings = asyncHandler(async (req, res) => {
  const listings = await Room.find().populate("landlordId", "name email");
  res.status(200).json(new ApiResponse(200, { listings }, "All room listings fetched successfully."));
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

  const updatedRoom = await Room.findByIdAndUpdate(id, updatedRoomData, {
    new: true,
    runValidators: true,
  });

  if (!updatedRoom) throw new ApiError(404, "Room not found.");

  res.status(200).json(new ApiResponse(200, { updatedRoom }, "Room listing updated successfully."));
});

