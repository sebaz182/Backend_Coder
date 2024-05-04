import mongoose from "mongoose";

const cartsCollection = 'carts';
const cartsSchema = new mongoose.Schema(
    {
        products: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity:{
                    type: Number,
                    require: true
                }
            }
        ]
    },
    {
        timestamps: true,
    }
)

export const cartModel=mongoose.model(
    cartsCollection,
    cartsSchema
)