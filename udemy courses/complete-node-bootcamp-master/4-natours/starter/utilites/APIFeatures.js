class APIFeatures {
    constructor(query, queryString) {
        this.query=query
        this.queryString=queryString
    }
    filter(){
        //console.log(this.queryString)
    const queryobj={...this.queryString}
    
   const try1=['page','sort','limit','fields']
    try1.forEach(i=>delete queryobj[i])
    console.log(this.queryString,queryobj)
    let querystr=JSON.stringify(queryobj)
    
    querystr=querystr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`)
    console.log(JSON.parse(querystr))

    // const alltours= await Tour.find(req.query);
//------------------convert the const query to let to chain filtering methodss------------//    
    //const query= Tour.find(JSON.parse(querystr));
   this.query=this.query.find(JSON.parse(querystr))
    //** */ let query= Tour.find(JSON.parse(querystr))**
    //console.log(query)
    // console.log(queryitem)
    // let history=JSON.stringify(req.query.)
    // searches.push(history);
    // console.log(history)
        return this;
}
    sort(){
        //------------------------------sorting------------------------------------------------//
    if(this.queryString.sort){
        const sortby=this.queryString.sort.split(',').join(' ')
        this.query=this.query.sort(sortby)
        //query=query.sort(sortby)
    }
    return this;


    }

    limitfields(){
        //-----------------------------field limiting----------------------------------//
    if(this.queryString.fields){
        const fields=this.queryString.fields.split(',').join('')
        this.query=this.query.select(fields)
    }else{
        this.query=this.query.select('-__v')
    }
    return this;
   
    }
    paginate(){
        const page=this.queryString.page*1 || 1;
        const limit=this.queryString.limit*1 || 100;
        const skip=(page-1)*limit;
    
        this.query=this.query.skip(skip).limit(limit)
    
        return this;
    }

}
module.exports=APIFeatures