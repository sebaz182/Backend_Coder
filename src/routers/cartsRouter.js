import { Router } from 'express';
import { CartManagerMONGO as CartManager } from '../dao/CartManagerMONGO.js';
import mongoose from 'mongoose';
import { ProductManagerMONGO as ProductManager } from '../dao/ProductManagerMONGO.js';

export const router = Router();

const cartManager = new CartManager()
const productManager = new ProductManager()

//Crear un nuevo carrito
router.post('/', async (req, res) => {
    let newCart = await cartManager.createCart({})
    return res.status(500).json({ newCart });
})

//Traer todos los carritos
router.get('/', async (req, res) => {
        let carts = await cartManager.getCarts();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ carts });
})

//Traer carrito por ID
router.get('/:cartId', async (req, res) => {
    const { cartId } = req.params;

    let validId = mongoose.Types.ObjectId.isValid(cartId);

    if (validId) {
        try {
            let cart = await cartManager.getCartById(cartId);

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
})

//Agregar producto indicado al carrito
router.post('/:cartId/product/:productId', async (req, res) => {
    const { cartId, productId } = req.params;

    let cart
    let product

    let validCardId = mongoose.Types.ObjectId.isValid(cartId);
    let validProddId = mongoose.Types.ObjectId.isValid(productId);

    //verifico que el id del carrito sea valido
    if (validCardId) {
        try {
            cart = await cartManager.getCartById(cartId);
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
                product = await productManager.getProductById(productId);

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
                    let cartUpdate = await cartManager.updateCart(cartId, cart)
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
})

//Descontar del carrito el producto seleccionado
router.delete('/:cartId/product/:productId', async (req, res) => {
    const { cartId, productId } = req.params;

    let cart
    let product

    let validCardId = mongoose.Types.ObjectId.isValid(cartId);
    let validProddId = mongoose.Types.ObjectId.isValid(productId);

    //verifico que el id del carrito sea valido
    if (validCardId) {

        cart = await cartManager.getCartById(cartId);
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ msj: `Cart no encontrado` });
        }

        //verifico que el id de producto sea valisdo
        if (validProddId) {
            product = await productManager.getProductById(productId);

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

                let cartUpdate = await cartManager.updateCart(cartId, cart)
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
})

//Eliminar todos los productos del carrito indicado
router.delete('/:cartId', async (req, res) => {
    const {cartId} = req.params;

    let cart

    let validCartId = mongoose.Types.ObjectId.isValid(cartId);

    //verifico que el id del carrito sea valido
    if (validCartId){
        cart = await cartManager.getCartById(cartId);
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ msj: `Cart no encontrado` });
        }

        cart.products = [];

        await cartManager.updateCart(cartId, cart)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ 
            msj: `Productos eliminados del carrito ${cartId}`,
            Cart: cart
        });

    } else {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json({ msj: `ID Carrito no valido` });
    }
})

//Actualizar el carrito con un arreglo de productos con el formato especificado arriba
router.put('/:cartId', async (req, res)=>{
    let {cartId} = req.params
    let productsBody = req.body

    let validCardId = mongoose.Types.ObjectId.isValid(cartId);

    //verifico que el id del carrito sea valido
    if (validCardId) {
        let cart = await cartManager.getCartById(cartId);
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ msj: `Cart no encontrado` });
        } else{
            cart.products.push(productsBody);

            let cartUpdate = await cartManager.updateCart(cartId, cart)

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
})

//Actualizar solo la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put('/:cartId/product/:productId', async (req, res) => {
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
            cart = await cartManager.getCartById(cartId);
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
            
                product = await productManager.getProductById(productId);

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
                    let cartUpdate = await cartManager.updateCart(cartId, cart)
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
})


export default router;