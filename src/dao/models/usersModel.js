import mongoose from "mongoose";

const usersCollection = "users";

const usersSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            require: true},
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        rol: {
            type: String,
            default: "user"
        },
        cart: {
            type: mongoose.Types.ObjectId,
            ref: "carts"
        }
    },
    {
        timestamps: true,
    }
)

export const userModel=mongoose.model(
    usersCollection,
    usersSchema
)



