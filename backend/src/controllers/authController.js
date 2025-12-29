import jwt from "jsonwebtoken";
import User from "../models/User.js";

const sign = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "7d"});

export const register = async(req,res) => {
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password) res.status(400).json({message: "Missing Fields"});
        const exists = await User.findOne({email});
        if(exists) return res.status(409).json({message: "Email Already used"});
        const user = await User.create({name,email,password, balance: 0});
        return res.status(201).json({token: sign(user._id), user: {id:user._id,name,email, balance: user.balance}});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

export const login = async (req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({message: "Invalid credentials"});
        }
        
        // Initialize balance if not set (for existing users)
        if(user.balance === undefined || user.balance === null) {
            user.balance = 0;
            await user.save();
        }
        
        return res.json({token: sign(user._id), user: {id: user._id, name:user.name, email, balance: user.balance}});
    } catch(e) {
        res.status(500).json({message: e.message});
    }
}

export const me = async(req,res) => {
    try {
        const user = await User.findById(req.userId).select("name email _id balance");
        if(!user) return res.status(404).json({message: "User not found"});
        
        // Initialize balance if not set
        if(user.balance === undefined || user.balance === null) {
            user.balance = 0;
            await user.save();
        }
        
        res.json(user);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

export const setInitialBalance = async(req,res) => {
    try {
        const {balance} = req.body;
        if(balance === undefined || isNaN(balance) || balance < 0) {
            return res.status(400).json({message: "Invalid balance amount"});
        }
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            {balance: +balance},
            {new: true}
        ).select("name email _id balance");
        
        if(!user) return res.status(404).json({message: "User not found"});
        res.json({message: "Balance updated", user});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

export const initializeAllBalances = async(req,res) => {
    try {
        // Update all users without balance field
        const result = await User.updateMany(
            {balance: {$exists: false}},
            {$set: {balance: 0}}
        );
        res.json({message: `Updated ${result.modifiedCount} users with balance field`});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};