const fs=require('fs')
const mongoose=require('mongoose');
const dotenv=require('dotenv')
const Tour=require('./models/tourmodel')

dotenv.config({path:"./config.env"})
const DB=process.env.DATABASE

 mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
    //useCreateIndex: true
    
 }).then(()=>{
    console.log('db connected')
})


const tours=JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`,'utf-8'))

const importdata=async()=>{
    try{    
       await Tour.create(tours)
       console.log("data uploaded")
       
        
        }catch(err){
       console.log(err)
       }
       process.exit()
   }
const deletedata=async()=>{
    try{
        await Tour.deleteMany();
        console.log("data deleted")
        
    }catch(err){
        console.log(err)

    }
    process.exit();
}


console.log(process.argv)
if(process.argv[2]==='--import'){
importdata()
}
else{
    deletedata()

}