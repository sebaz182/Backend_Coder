import mongoose from "mongoose";

const messageCollection = 'message';
const messageSchema = new mongoose.Schema(
    {
        socketId: {type:String, require: true},
        user:{type:String, require: true},
        message:{type:String, require: true}
    },
    {
        timestamps: true,
    }
)

export const messageModel=mongoose.model(
    messageCollection,
    messageSchema)