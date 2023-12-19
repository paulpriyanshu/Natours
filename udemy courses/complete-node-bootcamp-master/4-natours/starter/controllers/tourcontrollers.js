//const fs=require('fs');
const Tour=require('../models/tourmodel')
const APIFeatures=require('../utilites/APIFeatures')
//let searches=[];


//console.log(`${__dirname}`)
//const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

// exports.checkname=(req,res,next)=>{
//     const {name,price}=req.body
//     if(!name || !price){
//         return res.status(400).json({
//             status: "fail",
//             message:"invalid data"
//         })
//     }
//     next();
// }

exports.aliasCheapTopTours=(req,res,next)=>{
    req.query.limit='5';
    req.query.sort='price,-ratingsAverage';
    req.query.fields= 'name, difficulty, ratingsAverage, price';
    next();

}


exports.aliasTopExpensiveTours=(req,res,next)=>{
    req.query.limit='5'
    req.query.sort='-price,-ratingsAverage'
    req.query.fields= 'name, difficulty, ratingsAverage, price'
    next()

}

exports.getAlltours = async(req,res)=>{
try {
    
    const features =new APIFeatures(Tour.find(),req.query)
    .filter()
    .sort()
    .limitfields()
    .paginate();
    //const alltours=await query 
    const alltours=await features.query


    res.status(200).json({    
        status: 'success',
        requested_At: req.time,
        length: alltours.length,
    data:{
            alltours
        } 
})
}
catch(err){
    console.log(err)
}
}


exports.gettours=async(req,res)=>{
    const id=req.params.id;
    const getonetour= await Tour.findById(id);
    res.status(200).json({
        message: "success",
        data:{
            getonetour
        }
    })
}




//exports.gettour =(req,res)=>{

   
//     length=res.body
//     console.log(req.params)
//     const id=req.params.id*1;
//     const tour=tours.find(i=>i.id===id);
    
//     if(id>tours.length){
//         res.status(404).json({
//             message: " could not find id"
//         })
//     }

//     //res.json(tours)
       
//     else{
//     res.status(200).json({
//             status: 'success',
//             length: tours.length,
//         data :{
//                 tour
//             } 

//     })
// }
// }

exports.createtour= async(req,res)=>{
try{
    const newtour=await Tour.create(req.body)
    
     res.status(200).json({
        status: "success",
        data: {
            tour: newtour
        }
     })
    } catch(err){
        res.status(400).json({
            status: "failed",
            message: err
        })
    }
 //----------------------------/*USED JSON FILE/*-----------------------------------------------------//   
    //const newid=tours.length-1 

    
    
    // const newtours=Object.assign({id: newid}, req.body)
    // tours.push(newtours)
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
    //     res.status(201).json({
    //         status: 'success',
    //         length: tours.length,
    //        data :{
    //             tours
    //         } 
    
    //     })
    //     console.log(req.body)
    // })
}
exports.updatetour = async(req,res)=>{
try {
    const updatedtour= await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        validators: true
    });
    //const getonetour= await Tour.findById(req.params.id);
    res.status(200).json({
        message: "success",
        data:{
            updatedtour
        }
    })} catch(err){
        res.status(404).json({
            data:{
                err
            }
        })
      
    }
    
exports.deletetour=async(req,res)=>{
    //const alltours= await Tour.find();
try{

 await Tour.findByIdAndDelete(req.params.id)
    res.status(200).json({
        message:"success",
        data: null
    })
}

catch(err){
    console.log(err)
    res.status(404).json({
        status:'fail',
        message:err
    })

}
}
    //-----DONE WITH JSON DATA------------------------------------------------------------//
    // const tour=tours.find(i=>i.id===req.params.id*1)
    // if(req.params.id*1>tours.length){
    //     res.status(404).json({
    //         message: " could not find id"
    //     })
    // }
    // else{
    // const newtour=await tour.findOneAndUpdate(req.body)
    // res.status(200).json({
    //     message:"success",
    //     data: {
    //         tour
    //     }
    // })
}

exports.getTourstats=async(req,res)=>{
    try{
        
        const stats=await Tour.aggregate([
          {
            $match:{ratingsAverage:{$gte:4.5}}
          },
          {
            $group: {
                _id:'$id',
                num:{$sum:1},
                numratings:{$sum:'$ratingsQuantity'},
                avgrating :{$avg:'$ratingsAverage'},
                avgPrice:{$avg:'$price'},
                minPrice:{$min:'$price'},
                maxPrice:{$max:'$price'}
            }
          }  

        ])
        res.status(200).json({
            status:'success',
            data:{
                stats
            }
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}

exports.getmonthlyplan=async(req,res)=>{

    try{
        const months=['x','jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec']
        const year=req.params.year*1;
        const plan=await Tour.aggregate([
            {
            $unwind:'$startDates'
            },
            {
                $match:{
                    startDates:{
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`), 
                    }
                }
            },
            {
                $group:{
                    _id:{$month:'$startDates'},
                    
                    numtour:{$sum:1},
                    tours:{$push: '$name'}

                }
            },
           
            {
                $addFields:{ month :'$_id'}
            },
            {
                $project:{
                    _id:0
                }
            },{
                
            }
           
            // {
            //     $addFields: {
            //         month: {
            //             $let: {
            //                 vars: {
            //                     monthsInString: [ ,'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
            //                 },
            //                 in: {
            //                     $arrayElemAt: ['$monthsInString', '$_id']
            //                 }
            //             }
            //         }
            //     }
            // }
        ])
        res.status(200).json({
            status:'success',
            length: plan.length,
            data:{
                plan
            },
           })

    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        
    })
   
}

}