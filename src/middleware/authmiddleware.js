
const jwt=require('jsonwebtoken');
const userModel=require('../models/userModel')

const authmiddleWare= async(req,res,next)=>{
try {
    const headerToken=req.header('Authorization').replace('Bearer ','')
    const isMatch=jwt.verify(headerToken,'eshopping')

// console.log(isMatch);
// console.log(headerToken)
   const isUser=await userModel.findOne({_id:isMatch._id,'Tokens.token':headerToken});
//    console.log(isUser)
    if(!isUser){
        throw new Error()  
    }
    req.validUser=isUser
    req.headerToken=headerToken
    return  next();
} catch (error) {

    return res.status(400).send('not a valid token')
}

}




module.exports=authmiddleWare