import { Router } from 'express';

const router = Router();

router.get('/', (req,res)=>{
    
    res.send("Bienvenidos al Proyecto Final |Powered by Seba Zeballos|")
})

export default router;