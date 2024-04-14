export const errorHandler=(error, req, res, next)=>{
    if(error){
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({
            error:`Error inesperado en el servidor!`,
            detalle: `${error.message}`
        });
    }

    next()
}