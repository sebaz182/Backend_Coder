const deletProduct = async (productId) => {
    let cartId = document.getElementById("cartId")
    cartId = cartId.value;
    let cero = {
        "quantity": 0
    }
    
    let response = await fetch(`/api/carts/${cartId}/product/${productId}`,{
        method: "put",
        body: JSON.stringify(cero),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    if (response.status === 200){
        let datos = await response.json()
        location.reload()
    }
}

const saveChange = async (productId) => {
    let cartId = document.getElementById("cartId")
    let qId = "quantity_" + productId.toString()
    let quantityBody = document.getElementById(qId)

    cartId = cartId.value
    
    let quantity = {
        "quantity": quantityBody.value
    }
        
    let response = await fetch(`/api/carts/${cartId}/product/${productId}`,{
        method: "put",
        body: JSON.stringify(quantity),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    if (response.status === 200){
        let datos = await response.json()
        location.reload()
    }
}

const deleteAllProducts = async () => {
    let cartId = document.getElementById("cartId")
    cartId = cartId.value
    
    let response = await fetch(`/api/carts/${cartId}`,{
        method: "delete"
    })
    if (response.status === 200){
        let datos = await response.json()
        location.reload()
    }
}