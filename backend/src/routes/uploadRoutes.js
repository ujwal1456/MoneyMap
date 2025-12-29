import { Router } from "express";
import { handleUpload, upload } from "../controllers/uploadController.js";
import { auth } from "../middleware/auth.js";


const router = Router();
router.post("/",auth,upload.single("file"),handleUpload);
export default router;