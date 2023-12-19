const mongoose=require('mongoose')
const tourschema= new mongoose.Schema({
    id:{
        type:Number,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required: [true,'a tour must have a name '],
        
    },
    duration:{
        type:Number,
        required: true

    },
    maxGroupSize:{
        type: Number,
        required: true

    },
    difficulty:{
        type:String,

    },
    ratingsAverage:{
        type: Number,
        default:4.5
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required: [true,'a tour must have a price']
    },
    priceDiscount:{
        type:Number,
        validate: {
        validator:function(val){
            return val<this.price
        },
        message:
            'Discount price is incorrect'
        }
    },
  
    summary:{
        type:String,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:true 
    },
    images:[String],
    createdate:{
        type:Date,
        default:Date.now()

    },
    startDates:[Date]
   }
)

const Tour= mongoose.model('Tour',tourschema)

module.exports=Tour;
