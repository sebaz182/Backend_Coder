import mongoose from "mongoose";

const cartsCollection = 'carts';
const cartsSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    product_id: {
                        type: mongoose.Types.ObjectId,
                        ref: 'products'
                    },
                    quantity:{
                        type: Number,
                        require: true
                    }
                }
            ]
        }
    },
    {
        timestamps: true,
    }
)

cartsSchema.pre("find", function(){
    this.populate({
        path: "products.product_id",
    })
    .lean()
})

export const cartModel=mongoose.model(
    cartsCollection,
    cartsSchema
)