import { Router } from 'express';
import { SessionsController } from '../controllers/SessionsController.js';
import { generateHash } from '../utils.js'
import passport from 'passport';

export const router = Router()

router.get("/error", SessionsController.error )

router.post("/registre", passport.authenticate("registre",{failureRedirect:"/api/sessions/error"}), SessionsController.registre )

router.post("/login", passport.authenticate("login", {failureRedirect:"/api/sessions/error"}), SessionsController.login )

router.get("/github", passport.authenticate("github", {}), (req, res)=>{})

router.get("/callbackGithub", passport.authenticate("github", {failureRedirect:"/api/sessions/error"}), SessionsController.callbackGithub )

router.get("/logout",  SessionsController.logout)

