import Hostel from "../models/Hostel.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all available hostels
export const getAllHostels = asyncHandler(async (req, res) => {
  try {
    const hostels = await Hostel.find({ availabilityStatus: "available" });
    res.status(200).json(new ApiResponse(200, hostels, "Hostels fetched"));
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

// Get hostel by ID
export const getHostelById = asyncHandler(async (req, res) => {
  try {
    const hostelId = req.params.id;
    const hostel = await Hostel.findById(hostelId).populate(
      "adminId",
      "name email"
    );
    if (!hostel) {
      return res.status(404).json(new ApiResponse(404, null, "Hostel not found"));
    }
    hostel.viewsCount += 1;
    await hostel.save();
    res
      .status(200)
      .json(new ApiResponse(200, { hostel }, "Hostel details fetched"));
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

// Create hostel (Admin only)
export const createHostel = asyncHandler(async (req, res) => {
  try {
    let {
      title,
      description,
      hostelType,
      totalBeds,
      availableBeds,
      address,
      city,
      state,
      latitude,
      longitude,
      rentPerBed,
      amenities,
      facilities,
      adminRating,
      availabilityDate
    } = req.body;

    // Parse JSON strings if needed
    if (typeof amenities === 'string') {
      try {
        amenities = JSON.parse(amenities);
      } catch (e) {
        amenities = [];
      }
    }
    if (typeof facilities === 'string') {
      try {
        facilities = JSON.parse(facilities);
      } catch (e) {
        facilities = {};
      }
    }

    // Validate required fields
    if (!title || !hostelType || !totalBeds || !availableBeds || !address || !city || !state || !rentPerBed) {
      return res.status(400).json(
        new ApiResponse(400, null, "Missing required fields")
      );
    }

    // Build location object
    const location = {
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      coordinates: {
        type: "Point",
        coordinates: [
          parseFloat(longitude) || 77.4126, // Default Bhopal longitude
          parseFloat(latitude) || 23.2599   // Default Bhopal latitude
        ]
      }
    };

    // Get image URLs from uploaded files
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (file?.path) {
          imageUrls.push(file.path);
        }
      }
    }

    const hostel = new Hostel({
      title: title.trim(),
      description: description?.trim() || "",
      hostelType,
      totalBeds: parseInt(totalBeds),
      availableBeds: parseInt(availableBeds),
      location,
      rentPerBed: parseFloat(rentPerBed),
      amenities: amenities || [],
      images: imageUrls,
      facilities: facilities || {},
      adminId: req.user._id,
      adminRating: adminRating ? parseFloat(adminRating) : null,
      availabilityStatus: "available",
      availabilityDate: availabilityDate || new Date()
    });

    await hostel.save();
    res.status(201).json(new ApiResponse(201, { hostel }, "Hostel created successfully"));
  } catch (error) {
    console.error("Create hostel error:", error);
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

// Update hostel (Admin only)
export const updateHostel = asyncHandler(async (req, res) => {
  try {
    const hostelId = req.params.id;
    const updateData = req.body;

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json(new ApiResponse(404, null, "Hostel not found"));
    }

    // Save history before update
    hostel.history.push({
      updatedAt: new Date(),
      data: hostel.toObject()
    });

    Object.assign(hostel, updateData);
    await hostel.save();

    res.status(200).json(new ApiResponse(200, { hostel }, "Hostel updated successfully"));
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

// Delete hostel (Admin only)
export const deleteHostel = asyncHandler(async (req, res) => {
  try {
    const hostelId = req.params.id;
    const hostel = await Hostel.findByIdAndDelete(hostelId);

    if (!hostel) {
      return res.status(404).json(new ApiResponse(404, null, "Hostel not found"));
    }

    res.status(200).json(new ApiResponse(200, null, "Hostel deleted successfully"));
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

// Get all hostels for admin (including pending)
export const getAllHostelsForAdmin = asyncHandler(async (req, res) => {
  try {
    const hostels = await Hostel.find({});
    res.status(200).json(new ApiResponse(200, hostels, "All hostels fetched"));
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
