const express=require('express')
const {getAlltours,updatetour,gettours,createtour,aliasCheapTopTours,aliasTopExpensiveTours,getTourstats,getmonthlyplan,deletetour}=require('../controllers/tourcontrollers')
const {protect}= require('../controllers/authcontroller')
const router=express.Router()


//router.param('name',checkname)
router
    .route('/monthlyplan/:year')
    .get(getmonthlyplan)
router
    .route('/getstats')
    .get(getTourstats)
router
    .route('/top-5-cheap')
    .get(aliasCheapTopTours,getAlltours)
    
router
    .route('/top-5-expensive')
    .get(aliasTopExpensiveTours,getAlltours)

router
    .route('/')
    .get(protect,getAlltours)
    .post(createtour)

router
    .route('/:id')
    .get(gettours)
    .patch(updatetour)
    

module.exports=router;

