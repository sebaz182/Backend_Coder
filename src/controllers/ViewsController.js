// import { ProductsMongoDAO as ProductsDAO } from "../DAO/ProductsMongoDAO.js";
// import { ChatsMongoDAO as ChatsDAO } from "../DAO/ChatsMongoDAO.js";
// import { CartsMongoDAO as CartsDAO } from "../DAO/CartsMongoDAO.js";

import { cartsService } from "../services/CartsService.js";
import { productsService } from "../services/ProductsService.js";
import { chatsService } from "../services/ChatsService.js"

export class ViewsController {

    static home = (req, res) => {
        return res.render('home', {login: req.session.user})
    }

    static getProducts = async (req, res) => {
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
    
        // let { docs: products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await ProductsDAO.getProductsPagin(query, options);
        let { docs: products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productsService.getProductsPagin(query, options);

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
    }

    static getCarts = async (req, res) => {
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
    
        //let { docs: carts, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await CartsDAO.getCartsPagin(options);
        let { docs: carts, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await cartsService.getCartsPagin(options);
    
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
    }

    static getCartByID = async (req, res) => {

        let cartId = req.params.cartId
    
        //let cart = await CartsDAO.getCartById(cartId)
        let cart = await cartsService.getCartById(cartId)
    
        let totalCart = 0
    
        cart.products.forEach(function(product) {
            totalCart += product.product.price * product.quantity;
        });
    
    
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('cart', {cart, totalCart, login: req.session.user})
    }

    static registre = (req, res, next)=>{
        if(req.session.user){
            return res.redirect("/profile")
        }
    
        next()
    }
    
    static noRegistre = (req,res)=>{
        let {error}=req.query
    
        res.status(200).render('registre', {error, login: req.session.user})
    }

    static login = (req, res, next)=>{
        if(req.session.user){
            return res.redirect("/profile")
        }
    
        next()
    }
    
    static noLogin = (req,res)=>{
    
        let {error, mensaje}=req.query
    
        res.status(200).render('login', {error, mensaje, login: req.session.user})
    }

    static profile = (req,res)=>{
        res.status(200).render('profile',{
            user:req.session.user, login: req.session.user
        })
    }

    static realTimeProducts = async (req, res) => {

        let products
    
        try {
            //products = await ProductsDAO.getProducts();
            products = await productsService.getProducts();
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
    }

    static chat = async (req, res) => {

        let messages
    
        try {
            //messages = await ChatsDAO.getMessages();
            messages = await chatsService.getMessages();
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
    }

}