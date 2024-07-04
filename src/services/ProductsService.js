import { ProductsMongoDAO as ProductsDAO} from "../DAO/ProductsMongoDAO.js"

class ProductsService{
    constructor(dao){
        this.dao = dao
    }

    getProducts = async()=>{
        return this.dao.getProducts()
    }

    getProductsPagin = async(query, options)=>{
        return this.dao.getProductsPagin(query, options)
    }

    getProductById = async(id)=>{
        return this.dao.getProductById(id)
    }

    getProductBy = async(filter={})=>{
        return this.dao.getProductBy(filter={})
    }

    addProduct = async(product)=>{
        return this.dao.addProduct(product)
    }

    deleteProduct = async(filter={})=>{
        return this.dao.deleteProduct(filter={})
    }

    updateProduct = async (id, product)=>{
        return this.dao.updateProduct(id, product)
    }


}

export const productsService = new ProductsService(new ProductsDAO())