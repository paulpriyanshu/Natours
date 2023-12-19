 const mongoose=require('mongoose')
 const crypto = require('crypto')
 const validator=require('validator')
 const bcrypt=require('bcryptjs')
 
 const userschema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        validate: [validator.isEmail,'email required']

    },
    photo:{

        type: String
    },
    role:{
        type:String,
        enum: ['user','guide','lead-guide'],
        default: 'user'

    },
    password:{
        type:String,
        required:true,
        select: false
    },
    passwordConf:{
        type:String,
        required:true,
        validate:{
            validator: function(i)  {
                return i===this.password
            },
            message:"passwords are not same"
        }
    
    },
    passwordchangeAt:{
        type:Date
    },
    passwordresettoken:{
        type:String
    },
    passwordresetexpires:{
        type:Date
    }
    
    // passwordchangeconf:{
    //     type:String,
    //     validate:{
    //         validator:function(i){
    //             return i===this.passwordchange
    //         },
    //         message:"passwords are not the same"
    //     }
        
    // }
 })
 userschema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    this.password=await bcrypt.hash(this.password,12)
    this.passwordConf=undefined
    next()
 })
 userschema.methods.correctPassword= async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
 }

 userschema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordchangeAt){
        console.log(this.passwordchangeAt,JWTTimestamp)
        // const pwchangetime=parseInt(this.passwordchangeAt.getTime()/1000,10)
        // console.log(pwchangetime,JWTTimestamp)
        //return JWTTimestamp<pwchangetime
    }
    return false

 }

userschema.method.passwordresettoken= function(){
    const resettoken=crypto.randomBytes(32).toString('hex')
    this.passwordresettoken=crypto.createHash('sha256').update(resettoken).digest('hex');
    this.passwordresetexpires= Date.now() +10*60*1000;
    console.log({resettoken},this.passwordresettoken)
     
    return resettoken;

}


 const Users=mongoose.model('Users',userschema)
module.exports=Users