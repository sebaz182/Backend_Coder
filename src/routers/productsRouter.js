import { Router } from 'express';
import ProductManager from '../dao/ProductManager.js';
export const router = Router()

// import { auth } from '../middlewares/auth.js';

const productManager = new ProductManager('./src/data/products.json')

router.get('/', async (req,res)=>{
    
    let {limit} = req.query;

    const products = productManager.getProducts(limit);
    
    return res.json({products});
})

//middlewar a nivel de router
// router.get('/:productId', auth, async (req,res)=>{
//     const {productId} = req.params;
//     const product = p.getProductById(Number(productId));

//     return res.json({Producto: product})
// })

router.get('/:productId', async (req,res)=>{
    const {productId} = req.params;

    const product = productManager.getProductById(Number(productId));

    return res.json({Producto: product})
})

router.post('/', async (req, res)=>{
    let {title, description, price, thumbnails, code, stock, status=true, category} = req.body;

    if (!title || !description || !price || !code || !stock || !category){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Debe ingresar todos los atributos del producto!!!`})
    }
    try{
        const result = productManager.addProduct({...req.body})

        return res.status(500).json({result});
    }
    catch (error){
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.result}`
            })
    }
})

router.put('/:productId', async (req, res)=>{
    const {productId} = req.params;
    
    const result = productManager.updateProduct(Number(productId), req.body);

    return res.json({result})
})

router.delete('/:productId', async (req, res)=>{
    const {productId} = req.params;

    const result = productManager.deleteProduct(Number(productId));
    
    return res.json({result})
})

export default router;
