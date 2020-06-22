const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true, 
    },

    loginStatus:{
        type:Boolean,
      
    },

    email:{
        type:String,
        unique:true,
        lowercase:true,
        required:true,
        validate(value){
           if(!validator.isEmail(value)){

            throw new Error('not a valid email')
           }

            }
    
    },

    password:{
        type:String,
        required:true,
        minlenght:6,
        trim:true,
        validate(value){
            let str=value.toLowerCase().includes('pssword')
            if(str){
                throw new Error('password should not be password')
            }
        }
    
    },

    phonenumber:{type:Number,
        required:true,
        trim:true,
        validate(value){
            if(value<7){
                throw new Error('not a valid phone number')
            }
        }
    },

    avatar:{type:Buffer},

    Tokens:[{
        token:{type:String}
    }]



    },
    {
    timestamps:true
    })



userSchema.statics.validateUser=async function(email,password){

   const validUser=await userModel.findOne({email:email,password:password});
   validUser.loginStatus=true

    //  console.log(validUser)
    if(validUser==null){
        // validUser.loginStatus=false
        return new Error('User not found')
    }
  return validUser
}



userSchema.methods.generateToken=async function(){
    //  console.log(this._id.toString())
    // const token=jwt.sign({_id:this._id.toString()},'eshopping', {expiresIn:'1d'})
    const token=jwt.sign({_id:this._id.toString()},'eshopping')

    this.Tokens=this.Tokens.concat({token:token})
    await this.save();
    return token
}


const userModel=mongoose.model('userDetails', userSchema)


module.exports=userModel