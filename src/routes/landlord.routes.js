import Router from 'express';
import { submitRoom } from '../controllers/landlord.controllers.js';
import upload from '../config/multer.js';
import { protect } from '../middlewares/authenticate.middlewares.js';

const router = Router();

router.post(
  "/submit-room",
    protect, 
  upload.array("images", 5), 
  submitRoom
);

export default router;