const User=require('../models/usermodel')
exports.getAllusers = async(req,res)=>{
    const alluser=await User.find()

    res.status(200).json({
        status: 'err',
        message: ' not created',
        data:{
            alluser
        }
    })
}

exports.createuser =(req,res)=>{
    res.status(500).json({
        status: 'err',
        message: ' not created'
    })
}


exports.updateuser = (req,res)=>{
    res.status(500).json({
        status: 'err',
        message: ' not created'
    })
}

exports.deleteuser =(req,res)=>{
    res.status(500).json({
        status: 'error',
        message: ' not created'
    })
}

