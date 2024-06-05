import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { UserManagerMONGO as UserManager } from '../dao/UserManagerMONGO.js'
import { CartManagerMONGO as CartManager } from '../dao/CartManagerMONGO.js';
import { generateHash, validatePassword } from "../utils.js";


const userManager = new UserManager();
const cartManager = new CartManager();

export const initPassport=()=>{

    //registro
    passport.use(
        "registre",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email"
            },
            async(req, username, password, done)=>{
                try {
                    let {first_name, last_name, age, web} = req.body
                    if(!first_name || !last_name || !age){
                        return done(null, false)
                    }

                    let existe = await userManager.getBy({email: username})
                    if(existe){
                        return done(null, false)
                    }

                    console.log(web);

                    // hacer resto de validaciones

                    let newCart = await cartManager.createCart()
                    password = generateHash(password)

                    let user = await userManager.addUser({first_name, last_name, age, email:username, password, cart:newCart._id, rol:"user"})

                    console.log(user)
                    return done(null, user)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    //login
    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField:"email"
            },
            async(username, password, done)=>{
                try {
                    let user = await userManager.getByPopu({email:username})
                    if(!user){
                        return done(error)
                    }

                    if(!validatePassword(password, user.password)){
                        return done(null, false)
                    }

                    user = {...user}
                    delete user.password
                    return done(null, user)

                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    //github
    passport.use(
        "github",
        new github.Strategy(
            {
                clientID:"Iv23liCTQQ8hR8nT7Vcs",
                clientSecret:"16ca2d8ff6a78b5fe6b5454a8f48361508d48349",
                callbackURL:"http://localhost:3000/api/sessions/callbackGithub",
            },
            async (ta, tr, profile, done)=>{
                try {
                    let email=profile._json.email
                    let name =profile._json.name
                    if(!email){
                        return done(null, false)
                    }
                    let user = await userManager.getByPopu({email})
                    if(!user){
                        let newCart = await cartManager.createCart()
                        user = await userManager.addUser(
                            {
                                name, email, profile, cart: newCart._id
                            }
                        )
                        user =await userManager.getByPopu({email})
                    }
                return done(null, user)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
//paso 1´
    passport.serializeUser((user,done)=>{
        return done(null, user._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let user = await userManager.getBy({_id:id})
        return done(null, user)
    })
}