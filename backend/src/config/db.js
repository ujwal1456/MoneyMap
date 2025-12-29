import mongoose from "mongoose"

export const connectDB = async(uri) => {
    try {
        await mongoose.connect(uri, {dbName: "MoneyMap"});
        console.log("DB Connected");
    } catch (error) {
        console.error("MongoDB error: ",error.message);
        process.exit(1);
    }
}