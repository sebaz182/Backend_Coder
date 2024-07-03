import mongoose from "mongoose";

const usersCollection = "users";

const usersSchema = new mongoose.Schema(
    {
        first_name:{
            type: String,
            require: true
        },
        last_name:{
            type: String,
            require: true
        },
        email: {
            type: String,
            unique: true
        },
        age:{
            type: Number,
            require: true
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



