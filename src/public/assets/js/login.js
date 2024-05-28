const login=async(e)=>{
    e.preventDefault()
    let [email, password]=new FormData(document.getElementById("formLogin")).values()
    let body={
        email, password
    }

    let response = await fetch("/api/sessions/login", {
        method:"post", 
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(body)
    })

    if(response.ok){
        window.location.href="/profile"
    }else{
        window.location.href="/login?error=Error al validar"
    }
}