import {cartModel} from '../models/cartsModel.js'

export class CartsMongoDAO{

    //crear Carrito
    async createCart(cart){
        try {
            return await cartModel.create(cart)
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        } 
    }

    //recupero Cart por Id del carrito
    async getCartById(id){
        try {
            return await cartModel.findById(id).populate('products.product').lean();
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        }
    }
    
    //recupero todo los Carritos
    async getCarts(){
        try {
            return await cartModel.find();
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        }
    }

    //recupero todo los Carritos
    async getCartsPagin(options){
        try {
            return await cartModel.paginate({}, options);
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        }
    }
    
    //CON EL UPDATE PUEDO HACER TODAS LAS ACCIONES - LA LOGICA LA HAGO DESDE EL ROUTER
    //Agregar producto existente al carrito existente 
    //Descontar del carrito el producto seleccionado
    //Eliminar todos los productos del carrito
    //Actualizar el carrito con un arreglo de productos con el formato especificado arriba
    //Actualizar solo la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
    //Actualizar el carrito con un arreglo de productos con el formato especificado arriba
    //Actualizar solo la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
    async updateCart(cartId, cart){
        try {
            return await cartModel.findByIdAndUpdate(cartId, cart, {runValidators:true, returnDocument:"after"} );
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        }
    }

}

export default CartsMongoDAO
