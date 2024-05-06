const socket = io();

const addProductForm = document.getElementById('addProductForm');

addProductForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const status = document.getElementById('status').value;
    const category = document.getElementById('category').value;


    const product = {
        title: title,
        description: description,
        price: price,
        code: code,
        stock: stock,
        status: status,
        category: category
    }

    socket.emit('addProduct', product)
    addProductForm.reset()
});

socket.on("updateProduct", () => {  
    window.location.reload();    
})