import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import Admin from "../models/Admins.models.js";

export const verifyPanelAccess = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "No token provided");
      }
      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      const user = await Admin.findById(decoded.userId);
      if (!user || !["admin", "manager"].includes(user.role)) {
        throw new ApiError(403, "Unauthorized panel access");
      }

      req.user = user;

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        throw new ApiError(403, "Insufficient permissions");
      }

      next();
    } catch (error) {
      next(
        new ApiError(
          error.statusCode || 401,
          error.message || "Invalid or expired token"
        )
      );
    }
  };
};
