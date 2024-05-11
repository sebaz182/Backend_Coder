import {cartModel} from './models/cartsModel.js'

export class CartManagerMONGO{

    //crear Carrito
    async createCart(cart){
        return await cartModel.create(cart)
    }

    //recupero Cart por Id del carrito
    async getCartById(id){
        return await cartModel.findById(id).lean();
    }
    
    //recupero todo los Carritos
    async getCarts(){
        return await cartModel.find();
    }

    //Agregar producto existente al carrito existente 
    async addProductToCart(cartId, cart){
        return await cartModel.findByIdAndUpdate(cartId, cart, {runValidators:true, returnDocument:"after"} );
    }

    //Eliminar del carrito el producto seleccionado


    //Actualizar el carrito con un arreglo de productos con el formato especificado arriba


    //Actualizar solo la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body


    //Eliminar todos los productos del carrito

}

export default CartManagerMONGO
