import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
const router = Router();

const productManager = new ProductManager('../src/data/products.json')

router.get('/', (req,res)=>{
    
    return res.render('home')
})

router.get('/products', async (req,res)=>{
    
    let {limit} = req.query;

    let products
    try {
        products = productManager.getProducts(limit);
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            }
        )
    }

    res.setHeader('Content-Type','text/html');
    res.status(200).render('products',{products});

})

router.get('/realtimeproducts', async (req,res)=>{

    let products

    try {
        products = productManager.getProducts();
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            }
        )
    }
        
    res.setHeader('Content-Type','text/html');
    res.status(200).render('realTimeProducts',{products});
})


export default router;