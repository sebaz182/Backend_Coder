import express from 'express';
import {Server} from 'socket.io';
import {engine} from 'express-handlebars';

import {router as products} from './routers/productsRouter.js'
import carts from './routers/cartsRouter.js';
import views from './routers/viewsRouter.js';

import __dirname from './utils.js'
import path from 'path'

import ProductManager from './dao/ProductManager.js';

//IMPORTACION DE MIDDLEWARES
import { middleware01, middleware02 } from "./middlewares/generals.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const PORT=3000

const app=express()

const productManager = new ProductManager('../src/data/products.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler)//middleware a nivel de app
app.use(express.static(path.join(__dirname,'/public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use('/', views);
app.use('/api/products', products);
app.use('/api/carts', carts);

// app.use('/api/products',middleware02, products);//middelware a nivel endpoint


const expressServer = app.listen(PORT, ()=>console.log(`Server Online en puerto ${PORT}`));
//inicio el servidor con el comando 'nodemon app.js'
const io = new Server(expressServer)

io.on('connection', socket=> {

        const products = productManager.getProducts();
        socket.emit('products', products)

        socket.on('addProduct', product=>{
                productManager.addProduct({...product});
        });

});

console.log(__dirname)


