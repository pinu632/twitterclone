import mongoose from "mongoose";

export const connectMongoDB = async () =>{
    try{
        const conn = await mongoose.connect("mongodb://localhost:27017/twitter_clone");
        console.log(`db connected: ${conn.connection.host}`);
    }catch(error){
        console.error(`error: ${error.message}`);
        process.exit(1);
    }
}