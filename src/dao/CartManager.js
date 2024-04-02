import fs from 'fs'
import ProductManager from './ProductManager.js'


class CartManager {
    #carts;
    #path;

    constructor() {
        this.#path = '../src/data/carts.json';
        
        this.#carts = this.#readCartsInFile();
    }

    #readCartsInFile(){
        try {
            if(fs.existsSync(this.#path))
                return JSON.parse(fs.readFileSync(this.#path, 'utf-8'));

            return [];
        } catch (error) {
            console.log(`Ocurrio un error al leer el archivo de carritos ${error}`);
        }
    }

    #saveFile(){
        try {
            fs.writeFileSync(this.#path, JSON.stringify(this.#carts))
        } catch (error) {
            console.log(`Ocurrio un error al grabar el archivo de carritos ${error}`);
        }
    }

    #asigIdCarrito(){
        let id = 1;
            if (this.#carts.length != 0)
                id = this.#carts[this.#carts.length - 1].id + 1;
        return id;
    }

    createCart(){

        const newCart ={
            id: this.#asigIdCarrito(),
            products: []
        };

        this.#carts.push(newCart);
        this.#saveFile();
        return `El carrito ${newCart.id} fue Creado correctamente.`
    }

    getCartById(id){
        const cart = this.#carts.find(c => c.id === id)
        if (cart)
            return cart
        else
            return `El Carrito con id ${id} no existe!`
    }

    addProductToCart(cartId, productId){
        let result = `El carrito con id ${cartId} no existe`;

        const indexCart = this.#carts.findIndex(c => c.id === cartId);

        if (indexCart !== -1){
            const indexProductInCart = this.#carts[indexCart].products.findIndex(p => p.id === productId);
            const p = new ProductManager();
            const product = p.getProductById(productId); 

            if (product.status && indexProductInCart === -1){
                this.#carts[indexCart].products.push ({id: productId, 'quantity': 1});
                this.#saveFile();
                result = `Producto ${productId} agregado al Carrito id ${cartId}`
            }else if (product.status && indexProductInCart !== -1){
                ++this.#carts[indexCart].products[indexProductInCart].quantity;
                this.#saveFile();
                result = `Se sumo un Producto id ${productId} al Carrito id ${cartId}`
            }else if (!product.status){
                result = `El Producto con id ${productId} no existe`;
            }
            
        }

        return result
    }
}

export default CartManager