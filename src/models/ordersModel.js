const mongoose =require('mongoose');


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
    }
},{
    timestamps:true
});


const orderModel=mongoose.model('ordersmodel',ordersSchema);



module.exports=orderModel;