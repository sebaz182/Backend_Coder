import { Router } from 'express';
import ProductManager from '../dao/ProductManager.js';

const router = Router();

router.get('/', async (req,res)=>{

    const p = new ProductManager();
    const products = p.getProducts();
    
    res.render('realTimeProducts',{products})
})

export default router;