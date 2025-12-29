import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { createTxn, deletetxn, getTxn, getTxns, updateTxn } from "../controllers/transactionController.js";


const router = Router();
router.use(auth);
router.get("/",getTxns);
router.post("/",createTxn);
router.get("/:id",getTxn);
router.put("/:id",updateTxn);
router.delete("/:id",deletetxn);

export default router;