import { Router } from 'express';
import { CartsController } from '../controllers/CartsController.js'

export const router = Router();

//Crear un nuevo carrito
router.post('/', CartsController.creteCart)

//Traer todos los carritos
router.get('/', CartsController.getCarts)

//Traer carrito por ID
router.get('/:cartId', CartsController.getCartByID)

//Agregar producto indicado al carrito
router.post('/:cartId/product/:productId', CartsController.addProductToCart )

//Descontar del carrito el producto seleccionado
router.delete('/:cartId/product/:productId', CartsController.deleteProductFromCart )

//Eliminar todos los productos del carrito indicado
router.delete('/:cartId', CartsController.emptyCart )

//Actualizar el carrito con un arreglo de productos con el formato especificado arriba
router.put('/:cartId', CartsController.updateCartFromArray)

//Actualizar solo la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put('/:cartId/product/:productId', CartsController.updateProductToCart )


export default router;