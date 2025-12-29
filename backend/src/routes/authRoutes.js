import {Router} from "express";
import { login, me, register, setInitialBalance, initializeAllBalances } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = Router();
router.post("/register",register);
router.post("/login",login);
router.get("/me",auth,me);
router.post("/set-balance",auth,setInitialBalance);
router.post("/init-balances",initializeAllBalances);
export default router;