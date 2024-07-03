import { Router } from 'express';
import { io } from '../app.js';
import { ProductsController } from '../controllers/ProductsController.js';

export const router = Router()

//TRAIGO TODOS LOS PRODUCTOS DE LA BASE DE DATOS
router.get('/', ProductsController.getProducts)

//TRAIGO UN PRODUCTO BUSCANDO POR ID
router.get('/:productId', ProductsController.getProductsByID)

//ALTA DE PRODUCTO
router.post('/', ProductsController.addProduct)

//MODIFICACION DEL PRODUCTO
router.put('/:productId', ProductsController.updateProduct)

//ELIMINO PRODUCTO
router.delete('/:productId', ProductsController.deleteProduct)

export default router;
