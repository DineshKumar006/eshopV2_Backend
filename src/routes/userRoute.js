const userModel=require('../models/v1/userModel')
const Router=require('express').Router()
const multer=require('multer')
const sharp=require('sharp');
const authMiddleware =require('../middleware/authmiddleware')
const {v4:uuid} =require('uuid')
const fs=require('fs')

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

            // console.log(isuser)
                const token= await isuser.generateToken()
                return res.status(200).send({status:'Login sucess',isuser,token})

        } catch (error) {
            // console.log(isuser)
            return res.status(401).send({status:'Login Failed'})

        }
   
});



Router.route('/validateUser').get(authMiddleware,async(req,res)=>{

    try {
        res.status(200).send({token:true}) 

    } catch (error) {
        res.status(404).send({token:false}) 

    }


});


Router.route('/validateUser2').get(authMiddleware,async(req,res)=>{

    try {
        res.status(200).send({token:req.validToken}) 

    } catch (error) {
        res.status(404).send({token:false}) 

    }


})






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



const MIME_TYPE={
    'image/png':"png",
    'image/jpg':"jpg",
    "image/jpeg":"jpeg"
}



const imageUpload=multer({
    limits:{
        fileSize:5000000
    },

    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null, 'avatar/images')
        },

        filename:(req,file,cb)=>{
            let ext=MIME_TYPE[file.mimetype]
            cb(null,uuid()+'.'+ext)
        }
    })
})


Router.route('/myavatar').post(imageUpload.single('myavatar'),async(req,res)=>{

    let dest=`./newavatar/images/${uuid()}.png`
    console.log(req.body)

try {
    const newfile=await sharp(req.file.path).resize({width:300,height:300}).toFile(dest)
    console.log(dest)
    console.log(newfile)
    fs.unlinkSync(req.file.path)

} catch (error) {
        throw new Error('something went wonrg')
}

try {
    const data={
        ...req.body,
        loginStatus:false,
        avatar:null,
        avatarurl:dest
    }
const newUser=new userModel(data)
newUser.loginStatus=false

res.status(200).send({status:"Success",newUser})

} catch (error) {

    res.status(500).send({status:"Error"})

}



    

})



























// Router.route('/uploadprofilePic').post(imageUpload.single('image_Upload') ,authMiddleware, async(req,res)=>{

//     const newBuffer= await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
//     try {
//         req.validUser.avatar=newBuffer
//        await req.validUser.save();
//        console.log('success')
//         return res.status(200).send({status:'success'})
//     } catch (error) {
//         return res.status(500).send({status:'failed',e})

//     }
    
// });


Router.route('/getProfilePic/:id').get(async(req,res)=>{

    const user=await userModel.findOne({_id:req.params.id})
    try {
        if(user.avatar){
            res.set('Content-type', 'image/png');
            return res.status(200).send(user.avatar)
        }
    } catch (error) {
        return res.status(500).send('Error No avatar')
    }

})


// Router.route('/userProfile').get(authMiddleware,async(req,res)=>{

//     return res.status(200).send(req.validUser)

// });


Router.route('/userProfile').get(authMiddleware,async(req,res)=>{
        const {username,email,phonenumber,_id}=req.validUser
        const data={
            username,
            email,
            phonenumber,
            profilePic:`https://eshopping-backend.herokuapp.com/users/getProfilePic/${_id}`

        }
    return res.status(200).send(data)

});





























module.exports=Router
