import mongoose from "mongoose";

// writing the function to connect with mongodb database

export const connectDB=async() =>{
    try{
        mongoose.connection.on('connected',()=> console.log('Database Connected'));

        await mongoose.connect(`${process.env.MONGODB_URI}/chit-chat`)
    }catch (error){
        console.log(error);
    }
}