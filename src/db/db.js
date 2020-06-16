const mongoose=require('mongoose')
const url='mongodb+srv://root:root@cluster0-gxjis.gcp.mongodb.net/eshopping?retryWrites=true&w=majority'

mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})

var db=mongoose.connection

db.once('open',()=>{
    console.log('db is connected')
})