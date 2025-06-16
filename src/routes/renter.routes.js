import { Router } from "express";
import {
  expressInterest,
  addBookmarks,
  removeBookmark,
  getBookmarks,
} from "../controllers/renter.controllers.js"; 

const router = Router();

router.post("/rooms/:id/interest", expressInterest);

router.post("/rooms/:id/bookmark", addBookmarks);

router.delete("/rooms/:id/bookmark", removeBookmark);

router.get("/bookmarks/:id", getBookmarks);

export default router;
