import { Router } from "express";
const router = Router();

const categories = [
    { key: "Food", icon: "🍔" },
    { key: "Groceries", icon: "🛒" },
    { key: "Rent", icon: "🏠" },
    { key: "Recharge", icon: "📶" },
    { key: "Workout", icon: "🏋️" },
    { key: "Salary", icon: "💼" },
    { key: "Transport", icon: "🚌" },
    { key: "Education", icon: "📚" },
    { key: "Entertainment", icon: "📽️" }
]

router.get ("/",(req,res)=> res.json(categories))
export default router;