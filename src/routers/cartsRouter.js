import { Router } from 'express';
import CartManager from '../dao/CartManager.js';
export const router = Router();

const cartManager = new CartManager('../src/data/carts.json')

router.post('/', async (req,res)=>{

    const result = cartManager.createCart();
    return res.json({result});
})

router.get('/:cartId', async (req,res)=>{
    const {cartId} = req.params;
    
    const cart = cartManager.getCartById(Number(cartId));
    
    return res.json({Carrito: cart})
})

router.post('/:cartId/product/:productId', async (req,res)=>{
    const {cartId, productId} = req.params;

    const cart = cartManager.addProductToCart(Number(cartId), Number(productId));

    return res.json({cart})
})

export default router;