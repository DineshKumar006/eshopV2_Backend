const productModel=require('../models/productModel')
const Router=require('express').Router()
const multer=require('multer')
const sharp=require('sharp');


const imageUpload=multer({

    limits:{
        fileSize:100000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return cb(new Error('Format not allowed',false))
        }

     return   cb(false,true)
    }
})


Router.route('/productUpload').post(imageUpload.array('files',10),async(req,res)=>{

    const files=req.files

    //  console.log(files.length)
    //  console.log(req.body.itemtype)
    //   console.log(req.body.length)

   
if(files.length>1){
    try {
        req.files.map(async(ele)=>{
               const newProduct=new productModel()
               const newBuffer=await sharp(ele.buffer).resize({width:250,height:280}).png().toBuffer()
            //  console.log(req.body.itemtype)
                   newProduct.itemtype=req.body.itemtype,
                    newProduct.price=req.body.price,
                   newProduct.avatarStatus=ele.buffer?true:false,
                   newProduct.avatar=newBuffer ,
                   newProduct.discount=req.body.discount,
                   newProduct.gst=req.body.gst? req.body.gst: 30,
                   newProduct.extracharges=req.body.extracharges,

                   newProduct.size.M=req.body.medium,
                   newProduct.size.XL=req.body.XLarge,
                   newProduct.size.XXL=req.body.XXLarge,
                   newProduct.size.S=req.body.short,

                   newProduct.color=req.body.color,
                   newProduct.brand=req.body.brand


                   await newProduct.save();
              
           })
           
                return res.status(200).send({status:'Upload success'}) 
       
              
          } catch (error) {
           return res.status(500).send({status:'Error'}) 
       
          }
}else if (files.length==1){
    try {
        req.files.map(async(ele)=>{
               const newProduct=new productModel()
               const newBuffer=await sharp(ele.buffer).resize({width:250,height:280}).png().toBuffer()
                   newProduct.itemtype=req.body.itemtype,
                    newProduct.price=req.body.price,
                   newProduct.avatarStatus=ele.buffer?true:false,
                   newProduct.avatar=newBuffer ,
                   newProduct.discount=req.body.discount,
                   newProduct.gst=req.body.gst? req.body.gst: 30,
                   newProduct.extracharges=req.body.extracharges,

                   newProduct.size.M=req.body.medium,
                   newProduct.size.XL=req.body.XLarge,
                   newProduct.size.XXL=req.body.XXLarge,
                   newProduct.size.S=req.body.short,

                   newProduct.color=req.body.color,
                   newProduct.brand=req.body.brand

                   await newProduct.save();
              
           })
        //    console.log(newProduct)
                return res.status(200).send({status:'Upload success'}) 
       
              
          } catch (error) {
           return res.status(500).send({status:'Error'}) 
          };
       

}  

});


Router.route('/getProduct/:id').get(async(req,res)=>{
    productModel.findById({_id:req.params.id}).then(data=>{ 
         
        res.set('Content-type', 'image/png');
        return res.status(200).send(data.avatar)
    }).catch(e=>{
        return res.status(500).send('error')

    })
})


Router.route('/getProductByid/:id').get(async(req,res)=>{
    productModel.findById({_id:req.params.id}).then(data=>{ 
         const doc={
             Itemid:data._id,
            itemtype:data.itemtype,
            price:data.price,
            discount:data.discount,
            gst:data.gst,
            extracharges:data.extracharges,
            productLink:`https://eshopping-backend.herokuapp.com/products/getProduct/${data._id}`
             
         }
        // res.set('Content-type', 'image/png');
        return res.status(200).send(doc)
    }).catch(e=>{
        return res.status(500).send('error')

    })
})

Router.route('/getAllProduct').get(async(req,res)=>{
    
    productModel.find({}).then(data=>{ 
        const doc={
            items:data.map(ele=>{
                    return {
                        id:ele._id,
                        itemtype:ele.itemtype,
                        price:ele.price,
                        discount:ele.discount,
                        gst:ele.gst,
                        extracharges:ele.extracharges,
                        productLink:`https://eshopping-backend.herokuapp.com/products/getProduct/${ele._id}`
                        
                         }
                })
        }
        return res.status(200).send(doc)
      
    }).catch(e=>{
        return res.status(500).send('error')

    })
});


/*

Router.route('/getAllProductDetails').get(async(req,res)=>{
    
    productModel.find({}).then(data=>{ 
        const doc={
            name:'images url',
            items:data.map(ele=>{
                    return {
                        id:ele._id,
                        itemtype:ele.itemtype,
                        price:ele.price,
                        discount:ele.discount,
                        gst:ele.gst,
                        extracharges:ele.extracharges,
                        productLink:`https://eshopping-backend.herokuapp.com/products/getProduct/${ele._id}`
                        
                         }
                })
        }
        return res.status(200).send(doc)
      
    }).catch(e=>{
        return res.status(500).send('error')

    })
});
*/



//---------------------------------------------------
/*

Router.route('/getProductImg/:id').get(async(req,res)=>{
    productModel.findById({_id:req.params.id}).then(data=>{ 

        res.set('Content-type', 'image/png');
        return res.status(200).send(data.avatar)
    }).catch(e=>{
        return res.status(500).send('error')

    })
})




Router.route('/getAllItems').get(async(req,res)=>{
    
    productModel.find({}).then(data=>{ 

        // console.log(data)
        const doc={
            name:'images url',
            items:data.map(ele=>{
                    return {
                        Link:`http://localhost:8080/products/getProductImg/${ele._id}`
                        
                         }
                })
        }
        return res.status(200).send(doc)
      
    }).catch(e=>{
        return res.status(500).send('error')

    })
});


*/

/*
Router.route('/getAllProduct2').get(async(req,res)=>{
    
    try {
        const res=await productModel.find({})
        console.log(res)
        const doc={
            name:'images url',
            items:res.map(ele=>{
                    return {
                        id:ele._id,
                        itemType:ele.itemtype,
                        price:ele.price,
                        discount:ele.discount,
                        gst:ele.gst,
                        extracharges:ele.extracharges,
                        Link:`http://localhost:8080/products/getProduct/${ele._id}`
                        
                         }
                })
        }
        return res.status(200).send(doc)
        
    } catch (error) {
        return res.status(404).send("error")
    }
 
      
})

*/



module.exports=Router