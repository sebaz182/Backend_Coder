import { Router } from "express";
import { ProductManagerMONGO as ProductManager } from "../dao/ProductManagerMONGO.js";
import { ChatManager as ChatManager } from "../dao/ChatManager.js";
export const router = Router();

const productManager = new ProductManager();
const chatManager = new ChatManager();

//ROUTE HOME
router.get('/', (req, res) => {

    return res.render('home')
})

//ROUTE PAGE LISTADO DE PRODUCTOS
router.get('/products', async (req, res) => {
    
    let {page, limit, sort, query} = req.query;
    
    if (!page || page <= 0)
        page = 1
    
    if (!limit)
        limit =10
    
    let { docs: products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productManager.getProductsPagin(page, limit);

    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('products', { products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, page, limit} );
})

//ROUTE PAGE DEL CARRITO 





//ROUTE PAGE LISTADO DE PRODUCTOS EN TIEMPO REAL
router.get('/realtimeproducts', async (req, res) => {

    let products

    try {
        products = await productManager.getProducts();
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            }
        )
    }
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('realTimeProducts', { products });
})

router.get('/chat', async (req, res) => {

    let messages

    try {
        messages = await chatManager.getMessages();
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            }
        )
    }
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('chat', { messages });
})


export default router;