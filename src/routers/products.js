import { Router } from 'express';
import ProductManager from '../dao/ProductManager.js';

const router = Router();

router.get('/', (req,res)=>{
    const {limit} = req.query;

    const p = new ProductManager();
    
    res.json({Productos:p.getProducts(limit)})
})

router.get('/:productId', (req,res)=>{
    const {productId} = req.params;

    const p = new ProductManager();
    const product = p.getProductById(Number(productId));

    return res.json({Producto: product})
})

router.post('/', (req, res)=>{
    const {title, description, price, thumbnails, code, stock, status, category} = req.body;

    const p = new ProductManager();
    const result = p.addProduct(title, description, price, thumbnails, code, stock, status, category)

    return res.json({result})
})

router.put('/:productId', (req, res)=>{
    const {productId} = req.params;
    
    const p = new ProductManager();
    const result = p.updateProduct(Number(productId), req.body);

    return res.json({result})
})

router.delete('/:productId', (req, res)=>{
    const {productId} = req.params;

    const p = new ProductManager();
    const result = p.deleteProduct(Number(productId));
    
    return res.json({result})
})


export default router;
