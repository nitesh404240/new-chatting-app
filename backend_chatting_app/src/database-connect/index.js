import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        //it is always necesary to use the backtick(``) while using the connect ior these type of syntex to append 
        //we cant use the inverted comma or single tick on the place of this 
        console.log(`\nMongoDB connected! DB Host: ${connectionInstance.connection.host}`);
        console.log(`\nMongoDB connected! DB Name: ${connectionInstance.connection.name}`);
        console.log(`\nMongoDB connected! DB Port: ${connectionInstance.connection.port}`);
       
        
    } catch (error) {
        console.log("MONGODB connection error:", error);
        process.exit(1); // Exit with failure
    }
};

export default connectDB;