import { query } from 'express';
import {productModel} from '../models/productsModel.js'

export class ProductMongoDAO {
    
    //traer todos los productos
    async getProducts() {
        try {
            return await productModel.find().lean();
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        }   
    }

    //traer productos paginados
    async getProductsPagin(query, options){
        try {
            return await productModel.paginate(query, options)
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        } 
    }

    //traer producto por id
    async getProductById(id){
        try {
            return await productModel.findById(id).lean();
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        } 
    }


    //añadir un producto
    async addProduct(product) {
        try {
            return await productModel.create(product);
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        } 
    }
    
    //eliminar un producto
    async deleteProduct(filter={}){
        try {
            return await productModel.findByIdAndDelete(filter);
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        } 
    }

    //actualizar un producto
    async updateProduct(id, product){
        try {
            return await productModel.findByIdAndUpdate(id, product, {runValidators:true, returnDocument:"after"} );
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        } 
    }
}

export default ProductMongoDAO