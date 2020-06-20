const mongoose =require('mongoose');
const nodemailer=require('nodemailer');


const ordersSchema=mongoose.Schema({
    userId:{type:String},
    
    orderBy:{
        username:{type:String},
        email:{type:String},
    },

    productdetails:{
        productname:{type:String},
        price:{type:Number},
        paymentmode:{type:String},
        quantity:{type:Number},
        productLink:{type:String},
        cartid:{type:String},
        itemid:{type:String},

    },
    address:{
        username:{type:String},
        phone:{type:Number},
        house_number:{type:String},
        city:{type:String}
    },

    onlinepayment:{
        customerpaymentid:{type:String},
        paymentmode:{type:String}
    }

},{
    timestamps:true
});


ordersSchema.statics.generateMail=function(to,details){

    // console.log(details)

    
const senderUser=nodemailer.createTransport({
   
    service:'gmail',
    auth:{
        user:'brightseeeds@gmail.com',
        pass:'wings007'
    }
    
});

const mailOptions={
    from:'brightseeeds@gmail.com',
    to:to,
    subject:'Order success From Eshopping',
    text:`Yor order is placed find below details`,
    html:`<div><img src=${details.productLink} alt="product"/> , <h3> Price:${details.price} </h3> , <h3>paymentmode:${details.paymentmode}</h3>,<h3> quantity:${details.quantity}</h3></div> <div><h2>Happy Shopping With Eshopping</h2></div>`
}
senderUser.sendMail(mailOptions,(err,res)=>{
    if(err){
        return console.log(err)
    }
    return console.log(res)
})

};





const orderModel=mongoose.model('ordersmodel',ordersSchema);



module.exports=orderModel;