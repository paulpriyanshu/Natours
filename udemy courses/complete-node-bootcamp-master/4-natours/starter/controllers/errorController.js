const SenderrDev=(err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err: err,
        errstack: err.stack
    })
}
const SenderrProd=(err,res)=>{
    if(err.isOperational){
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        // err: err,
        //errstack: err.stack
    })}else{
        console.log('ERORR!!',err)
        res.status(500).json({
            status:'error',
            message:'Something went very wrong'
        })
    }
}




module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status||'error'
    if(process.env.NODE_ENV==='development'){
        SenderrDev(err,res)
    }else{
        SenderrProd(err,res)
    }
    
}
