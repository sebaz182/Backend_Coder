import { generateHash } from '../utils.js'
import passport from 'passport';

export class SessionsController {

    static error = (req,res)=>{
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error en la operacion!!` })    
    }

    static registre = (req, res)=>{
        res.setHeader('Content-Type', 'application/json')
        res.status(201).json({
            message: "Registro correcto...!!!", user: req.user
        })
    }

    static login = (req, res)=>{
        req.session.user = req.user
            
        res.setHeader('Content-Type', 'application/json')
        res.status(202).json({
            message: "Login correcto...!!!", user: req.user
        })
    }

    static callbackGithub = (req, res)=>{
        req.session.user = req.user
    
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Login exitoso...!!!", user :req.user});
    }

    static logout = (req, res)=>{
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
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Logout Exitoso...!!!"});
    }

}