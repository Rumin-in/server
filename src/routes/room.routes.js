import { Router } from "express";
import {
  getAllRooms,
  getRoomById,
} from "../controllers/room.controllers.js";

const router = Router();

router.get("/", getAllRooms);


router.get("/:id", getRoomById);

export default router;
