const addProduct = async (productId) => {
    let cartId = document.getElementById("cartId")
    cartId = cartId.value;

    let response = await fetch(`/api/carts/${cartId}/product/${productId}`,{
        method: "post",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    if (response.status === 200){
        let datos = await response.json()
        location.reload()
    }
}