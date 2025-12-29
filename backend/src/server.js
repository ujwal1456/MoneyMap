import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {connectDB} from "./config/db.js";
import User from "./models/User.js";

import authRoutes from "./routes/authRoutes.js";
import txnRoutes from "./routes/transactionRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
const app = express();

app.use(cors({origin: process.env.CLIENT_URL, credentials:true}));
app.use(express.json({limit: "2mb"}));

app.get("/",(_,res)=> res.send("MoneyMap API running"));
app.use("/api/auth",authRoutes);
app.use("/api/transactions",txnRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/uploads",uploadRoutes);
app.use("/api/categories",categoryRoutes);

const port = process.env.PORT || 5000;
connectDB(process.env.MONGODB_URI).then(async ()=> {
    // Initialize balances for all users without the balance field
    try {
        await User.updateMany(
            {balance: {$exists: false}},
            {$set: {balance: 0}}
        );
        console.log("Balance initialization complete");
    } catch(err) {
        console.log("Balance initialization:", err.message);
    }
    
    app.listen(port,()=> console.log(`Server on http://localhost:${port}`));
})