import { Router } from "express";
import {
  expressInterest,
  addBookmarks,
  removeBookmark,
  getBookmarks,
  enquire,
   reportIssue,
   referRoom,
   getNearByRooms,
   sendFeedback,
} from "../controllers/renter.controllers.js"; 
import { protect } from "../middlewares/authenticate.middlewares.js";

const router = Router();

router.post("/enquire", enquire);

router.post("/rooms/:id/interest", expressInterest);

router.post("/rooms/:id/bookmark", protect, addBookmarks);

router.delete("/rooms/:id/bookmark", protect, removeBookmark);

router.get("/bookmarks/:id", protect, getBookmarks);

router.post("/issues/report", protect, reportIssue);

router.post("/rooms/refer", protect, referRoom);

router.post("/rooms/getNearbyRooms", getNearByRooms);

router.post("/feedback", protect, sendFeedback);


export default router;
