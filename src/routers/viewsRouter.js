import { Router } from "express";
import { ProductManagerMONGO as ProductManager } from "../dao/ProductManagerMONGO.js";
import { ChatManager as ChatManager } from "../dao/ChatManager.js";
import {CartManagerMONGO as CartManager} from "../dao/CartManagerMONGO.js";
export const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

const chatManager = new ChatManager();

//ROUTE HOME
router.get('/', (req, res) => {

    return res.render('home')
})

//ROUTE PAGE LISTADO DE PRODUCTOS
router.get('/products', async (req, res) => {
    
    let {page, limit, sort, query} = req.query;

    if(query){
        query = JSON.parse(decodeURIComponent(query))
    }
    else{
        query = {}
    }

    page = parseInt(page);
    limit = parseInt(limit)

    if (!page || page <= 0 || isNaN(page))
        page = 1
    
    if (!limit || limit <= 0|| isNaN(limit))
        limit =10

    let sortURL = sort

    if (sort === 'asc' || sort === 'desc'){
        sort = {price: sort === 'asc' ? 1 : -1}
    }else{
        sort = null;
        sortURL = null
    }
    
    let options = {
        lean: true,
        page: page,
        limit: limit,
        sort: sort,
    }

    let { docs: products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productManager.getProductsPagin(query, options);

    //armado de links para paginacion
    let prevLink, nextLink, hasPrevLink, hasNextLink

    if (totalPages < page){
        return res.status(400).json({ error: "Lo sentimos, Pagina no encontrada" })
    } 

    query = JSON.stringify(query)
    
    if(prevPage){
        prevLink = `/products?limit=${limit}&page=${prevPage}&sort=${sortURL}&query=${query}`
    }

    if (nextPage){
        nextLink = `/products?limit=${limit}&page=${nextPage}&sort=${sortURL}&query=${query}`
    }

    if(hasPrevPage){
        hasPrevLink = `/products?limit=${limit}&page=1&sort=${sortURL}&query=${query}`
    }
    if(hasNextPage){
        hasNextLink = `/products?limit=${limit}&page=${totalPages}&sort=${sortURL}&query=${query}`
    }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('products', { products, totalPages, hasPrevPage, hasNextPage, page, prevLink, nextLink, hasPrevLink, hasNextLink} );
})

//ROUTE PAGE LISTADO DE CARRITOS COMPLETOS
router.get('/carts', async (req, res) => {
    let {page, limit} = req.query;

    page = parseInt(page);
    limit = parseInt(limit)

    if (!page || page <= 0 || isNaN(page))
        page = 1
    
    if (!limit || limit <= 0|| isNaN(limit))
        limit =10

    let options = {
        lean: true,
        page: page,
        limit: limit,
    }

    let { docs: carts, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await cartManager.getCartsPagin(options);

    console.log({carts});

    //armado de links para paginacion
    let prevLink, nextLink, hasPrevLink, hasNextLink

    if (totalPages < page){
        return res.status(400).json({ error: "Lo sentimos, Pagina no encontrada" })
    } 

    if(prevPage){
        prevLink = `/products?limit=${limit}&page=${prevPage}`
    }

    if (nextPage){
        nextLink = `/products?limit=${limit}&page=${nextPage}`
    }

    if(hasPrevPage){
        hasPrevLink = `/products?limit=${limit}&page=1`
    }
    if(hasNextPage){
        hasNextLink = `/products?limit=${limit}&page=${totalPages}`
    }


    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('carts', { carts, totalPages, hasPrevPage, hasNextPage, page, prevLink, nextLink, hasPrevLink, hasNextLink} );
})


//ROUTE DE UN CARRITO EN PARTICULAR
router.get('/carts/:cartId', async (req, res) => {

    let cartId = req.params.cartId

    let cart = await cartManager.getCartById(cartId)

    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('cart', {cart})
})



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

//ROUTE PAGE CHAT
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