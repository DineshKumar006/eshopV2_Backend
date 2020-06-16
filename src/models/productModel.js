const mongoose=require('mongoose');



const productSchema=mongoose.Schema({
    itemtype:{type:String},
     price:{type:Number},
     discount:{type:Number},
    avatarStatus:{type:Boolean},
    avatar:{type:Buffer},
    gst:{type:Number},
    extracharges:{type:Number}


},{
    timestamps:true
})



// userSchema.methods.toJSON=function(){

//     const isObject=this.toObject();

//     // delete isObject.avatar
    
// }

const imageModel=mongoose.model('productModel',productSchema)

module.exports=imageModel