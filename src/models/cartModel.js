const mongoose=require('mongoose')



const cartSchems=mongoose.Schema({
    userId:{type:String},
    userEmail:{type:String},
    itemtype:{type:String},
    price:{type:Number},
    avatarLinkId:{type:String},
    count:{type:Number},
    id:{type:String},
    gst:{type:Number},
    extracharges:{type:Number}

},{
    timestamps:true
})






const cartModel=mongoose.model('cartmodel',cartSchems);


module.exports=cartModel