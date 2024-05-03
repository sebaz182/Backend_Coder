import mongoose from "mongoose";

const messageCollection = 'message';
const messageSchema = new mongoose.Schema(
    {
        user:{type:String, require: true},
        message:{type:String, require: true}
    },
    {
        timestamps: true,
    }
)

export const cartModel=mongoose.model(
    messageCollection,
    messageSchema)