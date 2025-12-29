import { Router } from "express";
import { byCategory, summary, getBalance } from "../controllers/transactionController.js";
import { auth } from "../middleware/auth.js";

const router = Router();
router.use(auth);
router.get("/balance", getBalance);
router.get("/summary",summary);
router.get("/by-category",byCategory);

export default router;