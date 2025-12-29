import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const createTxn = async (req,res) => {
    try {
        const user = await User.findById(req.userId);
        if(!user) return res.status(404).json({message: "User not found"});

        // Ensure balance is a number
        let currentBalance = Number(user.balance) || 0;
        
        // Initialize balance if not set
        if(currentBalance === 0 && user.balance === undefined) {
            currentBalance = 0;
        }

        // Check if expense exceeds balance
        const amount = Number(req.body.amount);
        if(req.body.type === "expense" && amount > currentBalance) {
            return res.status(400).json({message: `Insufficient balance. Current balance: ₹${currentBalance}. Expense amount: ₹${amount}`});
        }

        const txn = await Transaction.create({...req.body, user: req.userId});

        // Update user balance
        if(req.body.type === "expense") {
            user.balance = currentBalance - amount;
        } else if(req.body.type === "income") {
            user.balance = currentBalance + amount;
        }
        await user.save();

        res.status(201).json(txn);
    } catch(err) {
        res.status(400).json({message: err.message});
    }
};

export const getTxns = async(req,res) => {
    try {
        const {type,category,from,to,page=1,limit=20} = req.query;
        const q={user: req.userId};
        if(type) q.type=type;
        if(category) q.category=category
        if(from || to) q.date ={};
        if(from) q.date.$gte = new Date(from);
        if(to) q.date.$lte = new Date(to);

        const txns = await Transaction.find(q)
            .sort({date: -1})
            .skip((page-1) * +limit)
            .limit(+limit);

            const count = await Transaction.countDocuments(q);
            res.json({items: txns, total: count});

     } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getTxn = async(req,res) => {
    const txn = await Transaction.findOne({ _id: req.params.id, user: req.userId});
    if(!txn) return res.status(404).json({message: "Not Found"});
    res.json(txn);
}

export const updateTxn = async(req,res) => {
    try {
        // Get the old transaction first
        const oldTxn = await Transaction.findOne({_id: req.params.id, user: req.userId});
        if(!oldTxn) return res.status(404).json({message: 'Not Found'});
        
        // Update the transaction
        const updatedTxn = await Transaction.findOneAndUpdate(
            {_id: req.params.id, user: req.userId},
            req.body,
            {new:true}
        );
        
        // Update user balance if amount or type changed
        const oldAmount = Number(oldTxn.amount) || 0;
        const newAmount = Number(req.body.amount) || oldAmount;
        const oldType = oldTxn.type;
        const newType = req.body.type || oldType;
        
        if(oldAmount !== newAmount || oldType !== newType) {
            const user = await User.findById(req.userId);
            if(user) {
                let currentBalance = Number(user.balance) || 0;
                
                // Reverse the old transaction's effect
                if(oldType === "expense") {
                    currentBalance += oldAmount;
                } else if(oldType === "income") {
                    currentBalance -= oldAmount;
                }
                
                // Apply the new transaction's effect
                if(newType === "expense") {
                    currentBalance -= newAmount;
                } else if(newType === "income") {
                    currentBalance += newAmount;
                }
                
                user.balance = currentBalance;
                await user.save();
            }
        }
        
        res.json(updatedTxn);
    } catch(error) {
        res.status(400).json({message: error.message});
    }
}

export const deletetxn = async (req,res) => {
    try {
        const txn = await Transaction.findOneAndDelete({_id: req.params.id, user: req.userId});
        if(!txn) return res.status(404).json({message: "Not Found"});
        
        // Restore user balance
        const user = await User.findById(req.userId);
        if(user) {
            let currentBalance = Number(user.balance) || 0;
            
            if(txn.type === "expense") {
                // Restore balance for deleted expense
                user.balance = currentBalance + txn.amount;
            } else if(txn.type === "income") {
                // Deduct balance for deleted income
                user.balance = currentBalance - txn.amount;
            }
            await user.save();
        }
        
        res.json({success: true, message: "Transaction deleted and balance updated"});
    } catch(error) {
        res.status(400).json({message: error.message});
    }
}

export const summary = async(req,res) => {
    const {type, from, to} = req.query;
    const match = {user: new mongoose.Types.ObjectId(req.userId)};
    if(type) match.type = type;
    if(from || to) match.date = {};
    if(from) match.date.$gte = new Date(from);
    if(to) match.date.$lte = new Date(to);

    const totals = {income: 0, expense: 0};
    (await Transaction.aggregate([{$match: match}, {$group: {_id: "$type",total: {$sum: "$amount"}}}]))
    .forEach(r=>{totals[r._id] = r.total; });
    totals.net = totals.income-totals.expense;
    res.json(totals);
};

export const byCategory = async(req,res) => {
    const {type,from,to} = req.query;
    const match = {user: new mongoose.Types.ObjectId(req.userId)};
    if(type) match.type = type;
    if(from || to) match.date = {};
    if(from) match.date.$gte = new Date(from);
    if(to) match.date.$lte = new Date(to);

    const data = await Transaction.aggregate([
        {$match: match},
        {$group: {_id: "$category", total: {$sum: "$amount"}}},
        {$sort: {total: -1}}
    ]);
    res.json(data.map(d=>({category: d._id, total: d.total})));
};

export const getBalance = async(req,res) => {
    try {
        const user = await User.findById(req.userId);
        if(!user) return res.status(404).json({message: "User not found"});
        
        let balance = user.balance;
        
        // Initialize balance if not set
        if(balance === undefined || balance === null) {
            balance = 0;
            user.balance = 0;
            await user.save();
        }
        
        // Ensure balance is a number
        balance = Number(balance) || 0;
        
        res.json({balance: balance});
    } catch(error) {
        console.error("getBalance error:", error);
        res.status(500).json({message: error.message});
    }
};