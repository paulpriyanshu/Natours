const Users= require('../models/usermodel')
//const {userschema.}=require('../models/usermodel')
const jwt=require('jsonwebtoken')
const AppError = require('../utilites/appErr')


const signtoken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_IN
})
}
exports.signup=async(req,res)=>{
    const newuser= await Users.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
        passwordchangeAt: req.body.passwordchangeAt
    })
    const token = signtoken(newuser._id)
    const sign_in_user=await Users.findById(newuser._id)
    const {name,email}=sign_in_user
    
    res.status(200).json({
        message:"success",
        token,
        data:{
            name,email
        }
    })
}

exports.login=async(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    const passwordchangeAt=req.body.passwordchangeAt
   
    if(!email||!password) return ('pls provide pass or email')
    const user=await Users.findOne({email}).select('+password')
    console.log(user)
    const correct= await user.correctPassword(password,user.password)
    if(!user||!correct) return ('incorrect email or password')
    const token=signtoken(user._id)
    res.status(200).json({
        status:'success',
        message:`Welcome ${user.name}`,
        token
        })
       
}
exports.protect= async(req,res,next)=>{
    let token
    //-------------------checking the headers ----------------------
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1]
        //console.log(token)
        }
    //-----------------checking token is awailable or not//-------------------------
        if(!token || !req.headers.authorization){
            res.status(401).json({
                status:'fail',
                message:'please login to access data'
    
            })
        }
        
       
    //----------checkin wether the user exists or not --------------------------
        const decoded=await jwt.verify(token,process.env.JWT_SECRET)
        console.log(decoded)
        console.log(decoded.id)
        const currentuser= await Users.findById(decoded.id)
         if(!currentuser){
            res.status(401).json({
                message:"user  does not exists"
            })
        }
        const loggedin=await Users.findById(decoded.id)
        console.log(loggedin.name)
      
        currentuser.changedPasswordAfter(decoded.iat)
        //     return next('password changed login again')
        // }
        // req.user=currentuser
        
next();   
}
// exports.passwordchange=(req,res,next)=>{
//     const email=req.body.email
    
// }
exports.restrictTO =(...roles) => {
    return (req, res, next)=>{
        if(!roles.includes(req.user.roles)){
            return next(
            new AppError('you dont have permission',403));
        }
    }
}
exports.forgetpassword=async(req,res,next)=>{
    const user = await Users.findOne({email:req.body.email})
    if(!user){
        return next(new AppError("there is no user with this email adress"))
    }
    const resettoken= user.passwordresettoken();
    await user.save({validateBeforeSave: false})
    
}

// exports.resetpassword=(req,res,next)=>{

// }

