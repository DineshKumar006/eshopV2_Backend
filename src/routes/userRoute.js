const userModel=require('../models/userModel')
const Router=require('express').Router()
const multer=require('multer')
const sharp=require('sharp');
const authMiddleware =require('../middleware/authmiddleware')

Router.route('/signup').post(async(req,res)=>{
    const reqFields=["username","email","password","phonenumber"]
    const fromBody=Object.keys(req.body);
    const isMatch=fromBody.every(ele=>reqFields.includes(ele));

    if(!isMatch){
        return req.status(400).send("not a valid operation")
    }
        const newUser=new userModel(req.body)
        newUser.loginStatus=false
try {
    await  newUser.save();
        // const token= await newUser.generateToken();
        res.status(200).send({status:"Sign up success",newUser})
} catch (e) {
    res.status(500).send({status:"Sign up Failed",e})

}
});


Router.route('/Login').post(async(req,res)=>{
        // console.log(req.body)
        try {
            const isuser=await userModel.validateUser(req.body.email,req.body.password);

            console.log(isuser)
                const token= await isuser.generateToken()
                return res.status(200).send({status:'Login sucess',isuser,token})

        } catch (error) {
            // console.log(isuser)
            return res.status(401).send({status:'Login Failed'})

        }
   
});


Router.route('/userProfile').get(authMiddleware,async(req,res)=>{

        return res.status(200).send(req.validUser)

});


Router.route('/getValidToken').get(async(req,res)=>{

})

Router.route('/Logout').post(authMiddleware,async(req,res)=>{
                
            try {
                 req.validUser.Tokens =  req.validUser.Tokens.filter(Token=>{
                    return Token.token !==req.headerToken  
                });
                req.validUser.loginStatus=false
                await req.validUser.save();
                return res.status(200).send({status:"Logout success",user:req.validUser})
            } catch (e) {

                return res.status(400).send({status:"Logout failed",e})
                
            }
 

});

Router.route('/LoginStatus').get(authMiddleware,async(req,res)=>{

        // console.log(req.header('Authorization'))

        return res.status(200).send({status:req.validUser.loginStatus})
   
})























/*

Router.route('/userDetails').post((req,res)=>{
    const data=req.body;
    const newUser=new userModel(data)
    newUser.save().then(user=>{
        console.log(user)
        return res.status(201).send(user)
    })
})


Router.route('/getUserDetails').get(async(req,res)=>{
    const data=await userModel.find({}).then(user=>{
        return res.status(200).send({status:'Success',user})

    }).catch(e=>{
        return res.status(500).send({error:'Something went wrong'})

    })
    // try {
    //     data.then(user=>{
    //         return res.status(200).send({status:'Success',user})
    //     })
    // } catch (error) {
    //     return res.status(500).send({error:'Something went wrong'})
    // }
   
})

//image upload 

const imageUpload=multer({
    //  dest:'image_file',
    limits:{
        fileSize:5000000
    },
    // fileFilter(req,file,cb){
    //     if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
    //         return cb(new Error('image format not allowed'))
    //     }
    // }


})

Router.route('/getUser/:id').post(async(req,res)=>{
    const isUser=await  userModel.findOne({_id:eq.params.id})
    console.log(isUser)
    return res.status(200).send({status:'success',user:isUser})
})


Router.route('/imageUpload/:id').post(imageUpload.single('image_Upload') ,async(req,res)=>{

  
    const newBuffer= await sharp(req.file.buffer).resize({width:500,height:500}).png().toBuffer()
    const isUser=await userModel.findOne({_id:req.params.id});
    try {
        isUser.avatar=newBuffer
       await isUser.save();
       console.log('success')
        return res.status(200).send({status:'success'})

    } catch (error) {
        return res.status(500).send({status:'failed'})

    }
    
})

Router.route('/viewImage/:id').get(async(req,res)=>{
    const isUser=await userModel.findOne({_id:req.params.id});
    try {
        if(isUser && isUser.avatar){
            res.set('Content-type', 'image/png');
            return res.status(200).send(isUser.avatar)
        }

    } catch (error) {
        return res.status(500).send('Error No avatar')

    }

})

*/

module.exports=Router
