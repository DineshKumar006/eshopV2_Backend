const nodemailer=require('nodemailer');



const senderUser=nodemailer.createTransport({
   
    service:'gmail',
    auth:{
        user:'brightseeeds@gmail.com',
        pass:'wings007'
    }
    
});




const mailOptions={
    from:'brightseeeds@gmail.com',
    to:'dc7600000@gmail.com',
    subject:'Order success From Eshopping',
    text:`Yor order is placed find below details`
}




senderUser.sendMail(mailOptions,(err,res)=>{
    if(err){
        return console.log(err)
    }

    return console.log(res)
})




















// const jwt =require('jsonwebtoken');


// const _id="5ee39da7de0c2a9400061b5b"
// const token=jwt.sign({_id:_id.toString()},'eshopping', {expiresIn:'1d'})


// console.log(token);



// const isMatch=jwt.verify(token,'eshopping')

// console.log(isMatch)