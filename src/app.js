import express from "express";
import home from './routers/home.js'
import products from './routers/products.js'
import carts from './routers/carts.js'

const PORT=3000

const app=express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('', home);
app.use('/api/products', products);
app.use('/api/carts', carts);

app.listen(PORT, ()=>console.log(`Server Online en puerto ${PORT}`))
//inicio el servidor con el comando 'nodemon app.js'


