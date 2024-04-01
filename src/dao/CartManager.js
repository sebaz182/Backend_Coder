import fs from "fs"

class CartManager {
    #carts;
    #products;
    #path;
    
    constructor() {
        this.#path = '../data/carts.json'
        this.#carts = this.#readCartsInFile
    }

    #readCartsInFile(){
        try {
            if(fs.existsSync(this.#path))
                return JSON.parse(fs.readFileSync(this.#path, 'utf-8'));

            return [];
        } catch (error) {
            console.log(`Ocurrio un error al leer el archivo de los carritos ${error}`);
        }
    }

    #saveFile(){
        try {
            fs.writeFileSync(this.#path, JSON.stringify(this.#carts))
        } catch (error) {
            console.log(`Ocurrio un error al grabar el archivo del carrito ${error}`);
        }
    }

    #asigIdCart(){
        let id = 1;
            if (this.#carts.length != 0)
                id = this.#carts[this.#carts.length - 1].id + 1;
        return id;
    }


}

export default CartManager