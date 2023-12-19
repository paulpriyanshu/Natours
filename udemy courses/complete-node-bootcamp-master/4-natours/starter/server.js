const mongoose=require('mongoose')
const dotenv= require('dotenv')
dotenv.config({path:'./config.env'})  
const app=require('./app');

const port=8000;
//console.log(process.env)

const DB=process.env.DATABASE
mongoose.connect(DB,{

    useNewUrlParser: true,
    useUnifiedTopology: true
    //useCreateIndex: true
    
 }).then(()=>{
    console.log('db connected')
})


  
//console.log(process.env)
app.listen(port,()=>{
    console.log("server has started")
})