import fs from 'fs'

class ProductManager {
    #products;
    #path;

    constructor() {
        this.#path = '../src/data/products.json';
        
        this.#products = this.#readProductsInFile();
    }

    #readProductsInFile(){
        try {
            if(fs.existsSync(this.#path))
                return JSON.parse(fs.readFileSync(this.#path, 'utf-8'));

            return [];
        } catch (error) {
            console.log(`Ocurrio un error al leer el archivo de productos ${error}`);
        }
    }

    #saveFile(){
        try {
            fs.writeFileSync(this.#path, JSON.stringify(this.#products))
        } catch (error) {
            console.log(`Ocurrio un error al grabar el archivo de productos ${error}`);
        }
    }

    #asigIdProduct(){
        let id = 1;
            if (this.#products.length != 0)
                id = this.#products[this.#products.length - 1].id + 1;
        return id;
    }

    addProduct(title, description, price, thumbnails=[], code, stock, status=true, category) {
        if (!title || !description || !price || !code || !stock || !category)
            return ('Debe ingresar todos los atributos del producto!!!');

        if (this.#products.some(p => p.code == code))
            return `El codigo ${code} ya existe`;

            const id = this.#asigIdProduct();
        
            const product = {
                id: id,
                title: title,
                description: description,
                price: price,
                thumbnails: thumbnails,
                code: code,
                stock: stock,
                status: status,
                category: category
            };

            this.#products.push(product);
            this.#saveFile();
            return `Producto ${product.code} agregado exitosamente`;        
    }

    getProducts(limit=0) {
        limit = Number(limit);
        if (limit > 0)
            return this.#products.slice(0,limit)
        return this.#products;
    }

    getProductById(id) {
        const product = this.#products.find(p => p.id === id)
        if (product)
            return product;
        else
            return `El Producto ${id} no fue encontrado!`;
    }

    updateProduct(id, objectUpdate){
        let result = `No encontramos el producto con id: ${id}`;

        const index = this.#products.findIndex(p=>p.id === id);

        if (index !== -1){
            const {id, ...rest} = objectUpdate;
            this.#products[index] = {...this.#products[index], ...rest};
            this.#saveFile();
            result = {
                msg: "El Producto fue actualizado",
                product: this.#products[index]
            }
        }

        return result;
    }

    deleteProduct(id){
        let result = `No encontramos el producto con id: ${id}`;

        const index = this.#products.findIndex(p=>p.id === id);

        if (index !== -1){
            this.#products = this.#products.filter(p=> p.id !== id);
            this.#saveFile();
            result = `Producto id: ${id} Eliminado!`
        }

        return result;
    }
}

export default ProductManager