import { Router } from 'express';
import CartManager from '../dao/CartManager.js';

const router = Router();

router.get('/:cartId', (req,res)=>{
    const {cartId} = req.params;
    
    return res.json({})
})

router.post('/', (req,res)=>{

    return res.json({})
})

router.post('/:cartId/product/:productId', (req,res)=>{
    const {cartId, productId} = req.params;
    return res.json({})
})

export default router;