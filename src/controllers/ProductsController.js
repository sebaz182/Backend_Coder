import { ProductMongoDAO as ProductManager } from '../DAO/ProductMongoDAO.js';
import mongoose from 'mongoose';

const productManager = new ProductManager()

export class ProductsController{

    static getProducts = async (req, res) => {

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
    }

    static getProductsByID = async (req, res) => {
        const { productId } = req.params;
    
        let validId = mongoose.Types.ObjectId.isValid(productId);
    
        if (validId) {
            try {
                let product = await productManager.getProductById(productId);
    
                if (product) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json({ Producto: product });
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
    }

    static addProduct = async (req, res) => {
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
        } else {
            try {
                let product = await productManager.addProduct({ ...req.body })
                io.emit('updateProduct', product);
                return res.status(500).json({ product });
    
            }
            catch (error) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json(
                    {
                        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                        detalle: `${error.result}`
                    })
            }
        }
    }

    static updateProduct = async (req, res) => {
        const { productId } = req.params;
    
        let validId = mongoose.Types.ObjectId.isValid(productId);
    
        //valido que el id enviado sea valido.
        if (validId) {
            let aModProduct = { ...req.body }
    
            //si me envian para modificar el id lo elimino
            if (aModProduct._id) {
                delete aModProduct._id
            }
    
            //traigo un producto si tiene el mismo codigo que envío
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
    
            //traigo el producto a modificar para comparar el codigo con el enviado
            let product
            try {
                product = await productManager.getProductById(productId)
            }
            catch (error) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json(
                    {
                        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                        detalle: `${error.result}`
                    })
            }
            //pregunto si existe el producto buscado
            if (product) {
                if (!existCode || product.code === aModProduct.code) {
                    try {
                        let productModif = await productManager.updateProduct(productId, aModProduct)
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(200).json({ ProductoModificado: productModif });
    
    
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
                    return res.status(400).json({ error: `Ya existe el Producto con Codigo ${code}!!!` })
                }
            } else {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ msj: `Producto no encontrado` });
            }
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ msj: `ID Producto no valido!` });
        }
    }

    static deleteProduct = async (req, res) => {
        const { productId } = req.params;
    
        let validId = mongoose.Types.ObjectId.isValid(productId);
    
        if (validId) {
            try {
                let product = await productManager.deleteProduct({ _id: productId });
                if (product) {
                    res.setHeader('Content-Type', 'application/json');
                    io.emit('updateProduct', product);
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
    }

}