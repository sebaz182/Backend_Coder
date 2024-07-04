import { CartsMongoDAO as CartsDAO} from "../DAO/CartsMongoDAO.js"

class CartsService{
    constructor(dao){
        this.dao = dao
    }

    createCart = async(cart)=>{
        return this.dao.createCart(cart)
    }

    getCartById = async(id)=>{
        return this.dao.getCartById(id)
    }

    getCarts = async()=>{
        return this.dao.getCarts()
    }

    getCartsPagin = async(options)=>{
        return this.dao.getCartsPagin(options)
    }

    updateCart = async(cartId, cart)=>{
        return this.dao.updateCart(cartId, cart)
    }


}

export const cartsService = new CartsService(new CartsDAO())