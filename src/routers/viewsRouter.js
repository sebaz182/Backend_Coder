import { Router } from "express";
import { ProductManagerMONGO as ProductManager } from "../dao/ProductManagerMONGO.js";
import { ChatManager as ChatManager } from "../dao/ChatManager.js";
import { CartManagerMONGO as CartManager } from "../dao/CartManagerMONGO.js";
import { auth } from '../middlewares/auth.js';

export const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

const chatManager = new ChatManager();

//ROUTE HOME
router.get('/', (req, res) => {

    return res.render('home', {login: req.session.user})
})

//ROUTE PAGE LISTADO DE PRODUCTOS
router.get('/products', auth ,async (req, res) => {
    //hardcodeo un id de carrito para trabajar como sesion 
    //let cartId = "6642ac698fd098eab5b02816" 

    let cartId = {
        _id: req.session.user.cart._id
    }
    
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
    res.status(200).render('products', { products, totalPages, hasPrevPage, hasNextPage, page, prevLink, nextLink, hasPrevLink, hasNextLink, cartId, login: req.session.user} );
})

//ROUTE PAGE LISTADO DE CARRITOS COMPLETOS
router.get('/carts', auth,async (req, res) => {
    let {page, limit} = req.query;

    let userRol = req.session.user.rol.toString();

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

    if(userRol === "admin"){
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('carts', { carts, totalPages, hasPrevPage, hasNextPage, page, prevLink, nextLink, hasPrevLink, hasNextLink, login: req.session.user} );
    } else {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Acceso denegado. Solo Administradores! `,
            }
        )
    }

})


//ROUTE DE UN CARRITO EN PARTICULAR
router.get('/carts/:cartId',auth , async (req, res) => {

    let cartId = req.params.cartId

    let cart = await cartManager.getCartById(cartId)

    let totalCart = 0

    cart.products.forEach(function(product) {
        totalCart += product.product.price * product.quantity;
    });


    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('cart', {cart, totalCart, login: req.session.user})
})

//VISTAS DE LAS SESIONES DE USUARIO
router.get('/registre',(req, res, next)=>{
    if(req.session.user){
        return res.redirect("/profile")
    }

    next()
},(req,res)=>{
    let {error}=req.query

    res.status(200).render('registre', {error, login: req.session.user})
})

router.get('/login',(req, res, next)=>{
    if(req.session.user){
        return res.redirect("/profile")
    }

    next()
}, (req,res)=>{

    let {error, mensaje}=req.query

    res.status(200).render('login', {error, mensaje, login: req.session.user})
})

router.get('/profile', auth, (req,res)=>{

    res.status(200).render('profile',{
        user:req.session.user, login: req.session.user
    })
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