import { Router } from "express";
import { auth } from '../middlewares/auth.js';
import { ViewsController } from "../controllers/ViewsController.js";

export const router = Router();

//ROUTE HOME
router.get('/', ViewsController.home )

//ROUTE PAGE LISTADO DE PRODUCTOS
router.get('/products', auth , ViewsController.getProducts )

//ROUTE PAGE LISTADO DE CARRITOS COMPLETOS
router.get('/carts', auth, ViewsController.getCarts )

//ROUTE DE UN CARRITO EN PARTICULAR
router.get('/carts/:cartId',auth , ViewsController.getCartByID )

//VISTAS DE LAS SESIONES DE USUARIO
router.get('/registre', ViewsController.registre, ViewsController.noRegistre )

router.get('/login', ViewsController.login, ViewsController.noLogin )

router.get('/profile', auth, ViewsController.profile )

//ROUTE PAGE LISTADO DE PRODUCTOS EN TIEMPO REAL
router.get('/realtimeproducts', ViewsController.realTimeProducts )

//ROUTE PAGE CHAT
router.get('/chat', ViewsController.chat )

export default router;