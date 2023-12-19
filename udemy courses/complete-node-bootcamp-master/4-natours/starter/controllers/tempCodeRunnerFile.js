exports.checkname=(req,res,next)=>{
    const {name,price}=req.body
    if(!name || !price){
        return res.status(400).json({
            status: "fail",
            message:"invalid data"
        })
    }
    next();
}
