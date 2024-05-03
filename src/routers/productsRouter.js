import { Router } from 'express';
import { ProductManagerMONGO as ProductManager } from '../dao/ProductManagerMONGO.js';
import { io } from '../app.js';
import mongoose from 'mongoose';
export const router = Router()


// import { auth } from '../middlewares/auth.js';

const productManager = new ProductManager()

//get de todos los productos
router.get('/', async (req, res) => {

    try {
        let products = await productManager.getProducts();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ products });
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.result}`
            }
        )
    }
})

//middlewar a nivel de router
// router.get('/:productId', auth, async (req,res)=>{
//     const {productId} = req.params;
//     const product = p.getProductById(Number(productId));

//     return res.json({Producto: product})
// })

//get producto por id
router.get('/:productId', async (req, res) => {
    const { productId } = req.params;

    let validId = mongoose.Types.ObjectId.isValid(productId);

    if (validId) {
        try {
            let product = await productManager.getProductBy({ _id: productId });
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ Producto: product });
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.result}`
                }
            )
        }
    } else {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json({ msj: `ID Producto no valido!` });
    }
})

//alta de producto
router.post('/', async (req, res) => {
    let { title, description, price, thumbnails = [], code, stock, status = true, category } = req.body;

    if (!title || !description || !price || !code || !stock || !category) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Debe ingresar todos los atributos del producto!!!` })
    }

    let existCode

    try {
        existCode = await productManager.getProductBy({ code })
    }
    catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.result}`
            })
    }

    if (existCode) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Ya existe el Producto con Codigo ${code}!!!` })
    }

    try {
        let newProduct = await productManager.addProduct({ ...req.body })
        io.emit("product", newProduct);
        return res.status(500).json({ newProduct });

    }
    catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.result}`
            })
    }
})

router.put('/:productId', async (req, res) => {
    const { productId } = req.params;

    let validId = mongoose.Types.ObjectId.isValid(productId);

    if (validId) {
        let aModProduct = { ...req.body }

        if (aModProduct._id) {
            delete aModProduct._id
        }

        let existCode
        let code = aModProduct.code

        try {
            existCode = await productManager.getProductBy({ code })
        }
        catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.result}`
                })
        }

        if (existCode) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ya existe el Producto con Codigo ${code}!!!` })
        } else {
            try {
                let productModif = await productManager.updateProduct(productId, aModProduct)
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ productModif });
            } catch (error) {
                console.log(error);
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json(
                    {
                        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                        detalle: `${error.result}`
                    }
                )
            }
        }
    } else {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json({ msj: `ID Producto no valido!` });
    }
})
//delete de producto
router.delete('/:productId', async (req, res) => {
    const { productId } = req.params;

    let validId = mongoose.Types.ObjectId.isValid(productId);

    if (validId) {
        try {
            let product = await productManager.deleteProduct({ _id: productId });
            console.log({ product });
            if (product) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ msj: `Producto eliminado`, product });
            } else {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ msj: `Producto no encontrado` });
            }
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.result}`
                }
            )
        }
    } else {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json({ msj: `ID Producto no valido!` });
    }
})

export default router;
