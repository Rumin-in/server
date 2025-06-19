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
} from "../controllers/renter.controllers.js"; 

const router = Router();

router.post("/enquire", enquire);

router.post("/rooms/:id/interest", expressInterest);

router.post("/rooms/:id/bookmark", addBookmarks);

router.delete("/rooms/:id/bookmark", removeBookmark);

router.get("/bookmarks/:id", getBookmarks);

router.post("/issues/report", reportIssue);

router.post("/rooms/refer", referRoom);

router.post("/rooms/getNearbyRooms", getNearByRooms);


export default router;
