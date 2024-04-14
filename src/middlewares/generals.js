export const middleware01=(req, res, next)=>{
    console.log('Pasa por Middleware 01!')
    
    next()
}

export const middleware02=(req, res, next)=>{
    console.log('Pasa por Middleware 02!')
    
    next()
}