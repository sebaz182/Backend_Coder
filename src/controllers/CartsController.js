import mongoose from 'mongoose';
// import { CartsMongoDAO as CartsDAO } from '../DAO/CartsMongoDAO.js';
// import { ProductsMongoDAO as ProductsDAO } from '../DAO/ProductsMongoDAO.js';

import { cartsService } from "../services/Cartsservice.js";
import { productsService } from "../services/ProductsService.js";

export class CartsController{

    static creteCart = async (req, res) => {
        // let newCart = await CartsDAO.createCart({})
        let newCart = await cartsService.createCart({})
        return res.status(500).json({ newCart });
    }

    static getCarts = async (req, res) => {
        // let carts = await CartsDAO.getCarts();
        let carts = await cartsService.getCarts();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ carts });
    }

    static getCartByID = async (req, res) => {
        const { cartId } = req.params;
    
        let validId = mongoose.Types.ObjectId.isValid(cartId);
    
        if (validId) {
            try {
                // let cart = await CartsDAO.getCartById(cartId);
                let cart = await cartsService.getCatById(cartId);
    
                if (cart) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json({ cart: cart });
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(404).json({ msj: `Cart no encontrado` });
                }
    
            } catch (error) {
                console.log(error);
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json(
                    {
                        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                        detalle: `${error.result}`
                    }
                )
            }
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ msj: `ID Carrito no valido` });
        }
    }

    static addProductToCart = async (req, res) => {
        const { cartId, productId } = req.params;
    
        let cart
        let product
    
        let validCardId = mongoose.Types.ObjectId.isValid(cartId);
        let validProddId = mongoose.Types.ObjectId.isValid(productId);
    
        //verifico que el id del carrito sea valido
        if (validCardId) {
            try {
                // cart = await CartsDAO.getCartById(cartId);
                cart = await cartsService.getCartById(cartId);
                if (!cart) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(404).json({ msj: `Cart no encontrado` });
                }
            } catch (error) {
                console.log(error);
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json(
                    {
                        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                        detalle: `${error.result}`
                    }
                )
            }
    
            //verifico que el id de producto sea valisdo
            if (validProddId) {
                try {
                    // product = await ProductsDAO.getProductById(productId);
                    product = await productsService.getProductById(productId);
                    if (!product) {
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(404).json({ msj: `Producto no encontrado` });
                    }
    
                    //comienzo a editar el registro
                    let indexProductInCart = cart.products.findIndex(p => p.product._id.toString() == productId)
    
                    if (indexProductInCart === -1) {
                        cart.products.push({ product: productId, quantity: 1 });
                    } else {
                        cart.products[indexProductInCart].quantity++;
                    }
    
                    try {
                        // let cartUpdate = await CartsDAO.updateCart(cartId, cart)
                        let cartUpdate = await cartsService.updateCart(cartId, cart);
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(200).json({ Carrito : cartUpdate });
                    
                    } catch (error) {
                        console.log(error);
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(500).json(
                            {
                                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                                detalle: `${error.result}`
                            }
                        )
                    }
    
                } catch (error) {
                    console.log(error);
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(500).json(
                        {
                            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                            detalle: `${error.result}`
                        }
                    )
                }
            } else {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ msj: `ID Producto no valido!` });
            }
    
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ msj: `ID Carrito no valido` });
        }
    }

    static deleteProductFromCart = async (req, res) => {
        const { cartId, productId } = req.params;
    
        let cart
        let product
    
        let validCardId = mongoose.Types.ObjectId.isValid(cartId);
        let validProddId = mongoose.Types.ObjectId.isValid(productId);
    
        //verifico que el id del carrito sea valido
        if (validCardId) {
    
            cart = await CartsDAO.getCartById(cartId);
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ msj: `Cart no encontrado` });
            }
    
            //verifico que el id de producto sea valisdo
            if (validProddId) {
                // product = await ProductsDAO.getProductById(productId);
                product = await productsService.getProductById(productId);

                    if (!product) {
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(404).json({ msj: `Producto no encontrado` });
                    }
    
                    //comienzo a editar el registro
                    let indexProductInCart = cart.products.findIndex(p => p.product._id.toString() == productId)
                    
                    if (indexProductInCart === -1) {
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(404).json({ msj: `Producto no encontrado en el Carrito` });
                    } else {
                        cart.products[indexProductInCart].quantity--;
                        if (cart.products[indexProductInCart].quantity <= 0){
                            cart.products.splice(indexProductInCart,1);
                        }
                    }
    
                    // let cartUpdate = await CartsDAO.updateCart(cartId, cart)
                    let cartUpdate = await cartsService.updateCart(cartId, cart);
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json({ 
                        msj: 'Producto eliminado del carrito - Carrito Actualizado! ',
                        Carrito : cartUpdate 
                    });
    
            } else {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ msj: `ID Producto no valido!` });
            }
    
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ msj: `ID Carrito no valido` });
        }
    }

    static emptyCart = async (req, res) => {
        const {cartId} = req.params;
    
        let cart
    
        let validCartId = mongoose.Types.ObjectId.isValid(cartId);
    
        //verifico que el id del carrito sea valido
        if (validCartId){
            // cart = await CartsDAO.getCartById(cartId);
            cart = await cartsService.getCartById(cartId);
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ msj: `Cart no encontrado` });
            }
    
            cart.products = [];
    
            // await CartsDAO.updateCart(cartId, cart)
            await cartsService.updateCart(cartId, cart);
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ 
                msj: `Productos eliminados del carrito ${cartId}`,
                Cart: cart
            });
    
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ msj: `ID Carrito no valido` });
        }
    }

    static updateCartFromArray = async (req, res)=>{
        let {cartId} = req.params
        let productsBody = req.body
    
        let validCardId = mongoose.Types.ObjectId.isValid(cartId);
    
        //verifico que el id del carrito sea valido
        if (validCardId) {
            // let cart = await CartsDAO.getCartById(cartId);
            let cart = await cartsService.getCartById(cartId);
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ msj: `Cart no encontrado` });
            } else{
                cart.products.push(productsBody);
    
                // let cartUpdate = await CartsDAO.updateCart(cartId, cart)
                let cartUpdate = await cartsService.updateCart(cartId, cart);

                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ 
                    msj: 'Carrito Actualizado! ',
                    Carrito : cartUpdate 
                });
            }
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ msj: `ID Carrito no valido` });
        }
    }

    static updateProductToCart = async (req, res) => {
        let { cartId, productId } = req.params;
        let quantityBody = req.body;
    
        let cart
        let product
        let quantityNumber = parseInt(quantityBody.quantity)
    
        let validCardId = mongoose.Types.ObjectId.isValid(cartId);
        let validProddId = mongoose.Types.ObjectId.isValid(productId);
    
        //verifico que el id del carrito sea valido
        if (validCardId) {
            try {
                // cart = await CartsDAO.getCartById(cartId);
                cart = await cartsService.getCartById(cartId);
                if (!cart) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(404).json({ msj: `Cart no encontrado` });
                }
            } catch (error) {
                console.log(error);
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json(
                    {
                        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                        detalle: `${error.result}`
                    }
                )
            }
    
            //verifico que el id de producto sea valisdo
            if (validProddId) {
                
                    // product = await ProductsDAO.getProductById(productId);
                    product = await productsService.getProductById(productId);

                    if (!product) {
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(404).json({ msj: `Producto no encontrado` });
                    }
    
                    //comienzo a editar el registro
                    let indexProductInCart = cart.products.findIndex(p => p.product._id.toString() == productId)
    
                    if(quantityNumber >= 0){
                        if (indexProductInCart === -1) {
                            cart.products.push({ product: productId, quantity: quantityNumber });
                        } else if (quantityNumber > 0){
                            cart.products[indexProductInCart].quantity = quantityNumber;
                        } else{
                            cart.products.splice(indexProductInCart,1);
                        }
                        // let cartUpdate = await CartsDAO.updateCart(cartId, cart)
                        let cartUpdate = await cartsService.updateCart(cartId, cart)
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(200).json({ Carrito : cartUpdate });
                    } else{
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(404).json({ msj: `La cantidad no puede ser menor a 0` });
                    }
            } else {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ msj: `ID Producto no valido!` });
            }
    
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ msj: `ID Carrito no valido` });
        }
    }


}