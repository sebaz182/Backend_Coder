import {productModel} from './models/productsModel.js'

export class ProductManagerMONGO {
    
    async getProducts(filter={}) {
        return await productModel.find(filter).lean();
    }

    async getProductById(id){
        return await productModel.findById(id).lean();
    }

    async getProductBy(filter={}) {
        return await productModel.findOne(filter).lean();
    }

    async addProduct(product) {
        return await productModel.create(product);
    }
    
    async deleteProduct(filter={}){
        return await productModel.findByIdAndDelete(filter);
    }

    async updateProduct(id, product){
        return await productModel.findByIdAndUpdate(id, product, {runValidators:true, returnDocument:"after"} );
    }
}

export default ProductManagerMONGO