import { Router } from 'express';
import { CartManagerMONGO as CartManager } from '../dao/CartManagerMONGO.js';
import mongoose from 'mongoose';
import { ProductManagerMONGO as ProductManager } from '../dao/ProductManagerMONGO.js';
export const router = Router();

const cartManager = new CartManager()
const productManager = new ProductManager()

router.post('/', async (req, res) => {


    try {
        let newCart = await cartManager.createCart({})
        return res.status(500).json({ newCart });
    }
    catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.result}`
            })
    }
})

router.get('/', async (req, res) => {
    try {
        let carts = await cartManager.getCarts();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ carts });
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
})

router.get('/:cartId', async (req, res) => {
    const { cartId } = req.params;

    let validId = mongoose.Types.ObjectId.isValid(cartId);

    if (validId) {
        try {
            let cart = await cartManager.getCartById(cartId);

            if (cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ Cart: cart });
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
                let productInCart = cart.products.find(p => p.product_id.toString() === productId)

                if (productInCart) {
                    productInCart.quantity++;
                } else {
                    cart.products.push({ product_id: productId, quantity: 1 });
                }

                try {
                    let cartUpdate = await cartManager.addProductToCart(cartId, cart)
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

export default router;