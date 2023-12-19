const express=require('express')
const path =require('path')
const app=express()
//const jwt=require('jsonwebtoken')
const morgan = require('morgan');
const tourrouter=require('./routes/tourRoutes')
const usersrouter=require('./routes/userRouter')
const AppError=require('./utilites/appErr')
const GlobalHandleError=require('./controllers/errorController')
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`))
app.use((req,res,next)=>{
    req.time=new Date().toISOString();
    const date=req.time
    //console.log(req.headers.host,date)
   next()
}) 
app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))

app.get('/home',(req,res)=>{
    res.set("Content-Security-Policy", "default-src 'self'");
    res.status(200).render('base.pug',{
        tours:'The Park Camper'
    })
})

app.use('/api/v1/tours/',tourrouter)
app.use('/api/v1/users/',usersrouter)

app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     message:`Can't find ${req.originalUrl} on this server`
    // })
    // const err=new Error (`Can't find ${req.originalUrl} on this server`)
    // err.status='fail'
    // err.statusCode=404

    
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
})
app.use(GlobalHandleError)

module.exports=app
