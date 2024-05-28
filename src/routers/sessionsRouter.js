import { Router } from 'express';
import { UserManagerMONGO as UserManager } from '../dao/UserManagerMONGO.js'
import { generateHash } from '../utils.js'
import { CartManagerMONGO as CartManager } from '../dao/CartManagerMONGO.js';
import passport from 'passport';

export const router = Router()

const userManager = new UserManager()
const cartManager = new CartManager()

router.get("/error",(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: `Error en la operacion` })
        
})

router.post("/registre", passport.authenticate("registre",{failureRedirect:"/api/sessions/error"}),(req, res)=>{
    res.setHeader('Content-Type', 'application/json')
    res.status(201).json({
        message: "Registro correcto...!!!", user: req.user
    })
})

router.post("/login", passport.authenticate("login", {failureRedirect:"/api/sessions/error"}),(req, res)=>{
    req.session.user = req.user
        
    res.setHeader('Content-Type', 'application/json')
    res.status(202).json({
        message: "Login correcto...!!!", user: req.user
    })
})

router.get("/github", passport.authenticate("github", {}), (req, res)=>{})

router.get("/callbackGithub", passport.authenticate("github", {failureRedirect:"/api/sessions/error"}), (req, res)=>{

    console.log("QUERY PARAMS:",req.query)
    req.session.user = req.user
    console.log(req.user)

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Login exitoso...!!!", user :req.user});
})


router.get("/logout", (req, res)=>{
    req.session.destroy(e=>{
        if(e){
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${error.message}`
                }
            )
            
        }
    })

    res.redirect("/")
    //res.setHeader('Content-Type','application/json');
    //return res.status(200).json({payload:"Logout Exitoso...!!!"});

})

