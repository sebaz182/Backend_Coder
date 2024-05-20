import express from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';

import { router as products } from './routers/productsRouter.js'
import { router as carts } from './routers/cartsRouter.js';
import { router as views } from './routers/viewsRouter.js';

import __dirname from './utils.js'
import path from 'path'

//conexion a la base de datos
import { conecctionDB } from './database/config.js';

import { ProductManagerMONGO as ProductManager } from './dao/ProductManagerMONGO.js';
import ChatManager from './dao/ChatManager.js';

//IMPORTACION DE MIDDLEWARES
import { middleware01, middleware02 } from "./middlewares/generals.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { log } from 'console';

const PORT = 3000

const app = express()

const productManager = new ProductManager();
const chatManager = new ChatManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler)//middleware a nivel de app
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser())

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use('/', views);
app.use('/api/products', products);
app.use('/api/carts', carts);

// app.use('/api/products',middleware02, products);//middelware a nivel endpoint


const expressServer = app.listen(PORT, () => console.log(`Server Online en puerto ${PORT}`));
//inicio el servidor con el comando 'nodemon app.js'
export const io = new Server(expressServer)

io.on('connection', async (socket) => {

        const products = await productManager.getProducts();
        socket.emit('products', products)

        socket.on('addProduct', async (product) => {
                let newProduct = await productManager.addProduct({ ...product });
                if (newProduct) {
                        products.push(newProduct);
                        socket.emit('products', products)
                }
        });


        ///conexion del chat
        console.log(`Se ha conectado un cliente con id ${socket.id}`)
        
        let usuarios =[]

        let messages = await chatManager.getMessages();
        messages = messages.map(m=> {
                return {user: m.user, message: m.message}
        })

        console.log(messages);

        socket.on("id", async (user, messages) => {
                console.log('no entra aca');
                usuarios.push({ socketId: socket.id, user })
                socket.emit("mensajesPrevios", messages)
                socket.broadcast.emit("nuevoUsuario", user)
        })

        socket.on("mensaje", async (user, message) => {
                let newMessage = ({ socketId: socket.id, user: user, message: message });
                try {
                        await chatManager.addMessage(newMessage);
                        // mensajes.push({ user, message })
                        io.emit("nuevoMensaje", user, message)

                }
                catch (error) {
                        console.log(error);
                }
        })

        socket.on("disconnect", () => {
                let usuario = usuarios.find(u => u.socketId === socket.id)
                if (usuario) {
                        io.emit("saleUsuario", usuario.user)
                }
        })
});

console.log(__dirname)

conecctionDB();

