import { Router } from 'express';
import CartManager from '../dao/CartManager.js';

const router = Router();

router.post('/', async (req,res)=>{
    const c = new CartManager();
    const result = c.createCart();
    return res.json({result});
})

router.get('/:cartId', async (req,res)=>{
    const {cartId} = req.params;
    
    const c = new CartManager();
    const cart = c.getCartById(Number(cartId));
    
    return res.json({Carrito: cart})
})

router.post('/:cartId/product/:productId', async (req,res)=>{
    const {cartId, productId} = req.params;

    const c = new CartManager();
    const cart = c.addProductToCart(Number(cartId), Number(productId));

    return res.json({cart})
})

export default router;