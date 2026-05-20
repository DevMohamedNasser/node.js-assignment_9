import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: "./src/Config/dev.env"});

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", ()=> {
            console.log("DB connected successfully");
        })

        await mongoose.connect(process.env.DB_URI, {
            serverSelectionTimeoutMS: 5000
        });
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;