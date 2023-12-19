const express=require('express')
const {getAllusers,createuser,updateuser,deleteuser}=require('../controllers/user controllers')
const {signup,login,passwordchange,forgetpassword,resetpassword}=require('../controllers/authcontroller')
const router=express.Router()


router.post('/signup',signup)
router.post('/login',login)
//router.patch('/login/changepw',passwordchange)
router.post('/forgetpassword',forgetpassword)
//router.post('/restpassword',resetpassword)
router
    .route('/')
    .get(getAllusers)
    .post(createuser)
    
    
    
router
    .route('/:id')
    .patch(updateuser)
    .delete(deleteuser)

module.exports=router;



