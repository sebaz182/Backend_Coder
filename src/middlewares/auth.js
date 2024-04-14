export const auth=(req, res, next)=>{

    let {user, password}=req.query
    if(!user || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Complete Usuario y Contraseña`});
    }

    if(user!=="admin" || password!=="coder"){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Credenciales invalidas`});
    }

    next()
}