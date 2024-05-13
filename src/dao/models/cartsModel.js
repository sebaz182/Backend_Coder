import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"

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

cartsSchema.plugin(paginate)

export const cartModel=mongoose.model(
    cartsCollection,
    cartsSchema
)