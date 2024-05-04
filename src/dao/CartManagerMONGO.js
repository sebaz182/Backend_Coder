import {cartModel} from './models/cartsModel.js'

export class CartManagerMONGO{

    //crear Carrito
    async createCart(cart){
        return await cartModel.create(cart)
    }

    async getCartById(id){
        return await cartModel.findById(id).lean();
    }

    async getCarts(){
        return await cartModel.find().lean();
    }

    async addProductToCart(cartId, cart){
        return await cartModel.findByIdAndUpdate(cartId, cart, {runValidators:true, returnDocument:"after"} );
    }

}

export default CartManagerMONGO
