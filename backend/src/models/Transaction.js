import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        type: {type: String, enum: ["income","expense"], required: true},
        amount: {type: Number, required:true, min:0},
        category: {type: String, required: true},
        account: {type: String, default: "Main"},
        date: {type: Date, required: true},
        note: {type: String},
        receiptUrl: {type: String}
    },
    {timestamps: true}
);

export default mongoose.model("Transaction",transactionSchema);
