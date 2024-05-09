import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"

const productsCollection = "products";

const productsSchema = new mongoose.Schema(
    {
        title: {type: String, require: true},
        description: {type: String, require: true},
        price: {type: Number, require: true},
        code: {type: String, require: true, unique: true},
        thumbnails: [{type: String}],
        stock: {type: Number, require: true},
        status: {type: Boolean, default: true},
        category: {type: String, require: true}
    },
    {
        timestamps: true,
    }
)

productsSchema.plugin(paginate)

export const productModel=mongoose.model(
    productsCollection,
    productsSchema
)
