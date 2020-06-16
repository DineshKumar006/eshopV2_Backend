const Router=require('express').Router();
const cartModel=require('../models/cartModel')
const authMiddleware=require('../middleware/authmiddleware')

Router.route('/addItemtocart').post(authMiddleware, async(req,res)=>{

        const newcartData=new cartModel();
        newcartData.userId=req.validUser._id
        newcartData.userEmail=req.body.userEmail
        newcartData.avatarLinkId=req.body.avatarLinkId;
        newcartData.itemtype=req.body.itemtype ;
        newcartData.price=req.body.price
        newcartData.count=req.body.count
        newcartData.id=req.body.id
        newcartData.gst=req.body.gst
        newcartData.extracharges=req.body.extracharges

        newcartData.save().then(data=>{
            return res.status(201).send({status:'Success',data})
        }).catch(e=>{
            return res.status(501).send({start:'Someting went wrong',e})
        })
});

Router.route('/getCartData').get(async(req,res)=>{
    cartModel.find({}).then(data=>{
        // console.log(data)

        return res.status(200).send(data)
    }).catch(e=>{
        return res.status(404).send("error")

    })
})

Router.route('/getMycartdata').get(authMiddleware,async(req,res)=>{
        cartModel.find({userId:req.validUser._id}).then(data=>{
            return res.status(200).send(data)
        }).catch(e=>{
            return res.status(404).send("error")
    
        })
});




Router.route('/deletefromcart/:id').delete(authMiddleware,async(req,res)=>{

    cartModel.findByIdAndDelete(req.params.id).then(data=>{
        // return res.status(200).send({status:'Delete success',data})
        cartModel.find({userId:req.validUser._id}).then(data=>{
            return res.status(200).send(data)
        })
    }).catch(e=>{
        return res.status(500).send({status:'Delete failed!',e})
    })
})


Router.route("removefromcart/:id").delete(async(req,res)=>{

    cartModel.find({}).then(data=>{

        const reqData=data.filter(ele=>{
                return ele._id !== req.params.id
        })


        return res.status(200).send(reqData)


    })

})


module.exports= Router