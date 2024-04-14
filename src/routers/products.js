import { Router } from 'express';
import ProductManager from '../dao/ProductManager.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.get('/', async (req,res)=>{
    const {limit} = req.query;

    const p = new ProductManager();
    const products = p.getProducts(limit);
    
    res.render('products',{products})
})

//middlewar a nivel de router
// router.get('/:productId', auth, async (req,res)=>{
//     const {productId} = req.params;

//     const p = new ProductManager();
//     const product = p.getProductById(Number(productId));

//     return res.json({Producto: product})
// })

router.get('/:productId', async (req,res)=>{
    const {productId} = req.params;

    const p = new ProductManager();
    const product = p.getProductById(Number(productId));

    return res.json({Producto: product})
})

router.post('/', async (req, res)=>{
    //const {title, description, price, thumbnails, code, stock, status, category} = req.body;

    const p = new ProductManager();
    const result = p.addProduct({...req.body})

    return res.json({result})
})

router.put('/:productId', async (req, res)=>{
    const {productId} = req.params;
    
    const p = new ProductManager();
    const result = p.updateProduct(Number(productId), req.body);

    return res.json({result})
})

router.delete('/:productId', async (req, res)=>{
    const {productId} = req.params;

    const p = new ProductManager();
    const result = p.deleteProduct(Number(productId));
    
    return res.json({result})
})


export default router;
