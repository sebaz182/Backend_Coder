import { Router } from 'express';
import { UserManagerMONGO as UserManager } from '../dao/UserManagerMONGO.js'
import { generateHash } from '../utils.js'
import { CartManagerMONGO as CartManager } from '../dao/CartManagerMONGO.js';

export const router = Router()

const userManager = new UserManager()
const cartManager = new CartManager()

router.post('/registre', async (req, res) => {
    let { name, email, password, web } = req.body
    if (!name || !email || !password) {
        if (web) {
            return res.redirect(`/registre?error=Complete user, email, y password`)
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Complete user, email, y password` })
        }
    }

    let existe = await userManager.getBy({ email })

    if (existe) {
        if (web) {
            return res.redirect(`/registre?error=Ya existe ${email}`)
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ya existe ${email}` })
        }
    }

    password = generateHash(password)

    try {
        let newCart = await cartManager.createCart()
        let newUser = await userManager.addUser({ name, email, password, rol: "user", cart: newCart._id })
        if (web) {
            return res.redirect(`/login?mensaje=Registro correcto para ${name}`)
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json({
                message: "Registro correcto...!!!", newUser
            })
        }
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})

router.post("/login", async (req, res) => {
    let { email, password, web } = req.body

    if (!email || !password) {
        if (web) {
            return res.redirect(`/login?error=Complete email, y password`)
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Complete email, y password` })
        }
    }

    // otras validaciones
    // preguntar por adminCoder@coder.com, y la contraseña adminCod3r123
    // si son esos datos, devolves al usuario nombre "admin", email 
    // adminCoder@coder.com y rol "admin"


    // let usuario=await usuariosManager.getBy({email, password:generaHash(password)})
    let user = await userManager.getByPopu({ email, password: generateHash(password) })
    if (!user) {
        if (web) {
            return res.redirect(`/login?error=Credenciales invalidas`)
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Credenciales inválidas` })
        }
    }

    user = { ...user }
    delete user.password
    req.session.user = user

    if (web) {
        res.redirect("/profile")
    } else {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: "Login correcto", user });
    }

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

