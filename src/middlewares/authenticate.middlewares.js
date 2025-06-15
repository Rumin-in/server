import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const protect = asyncHandler((req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) throw new ApiError(401, "Unauthorized");
  if (token === "null") throw new ApiError(401, "Unauthorized");
  if (token === "undefined") throw new ApiError(401, "Unauthorized");
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) throw new ApiError(403, "Invalid token");
    req.user = { _id: decoded.userId };
    next();
  });
});
