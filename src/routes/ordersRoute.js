const ordersModel=require('../models/ordersModel');
const Router=require('express').Router()
const authMiddleware=require('../middleware/authmiddleware')



Router.route('/addorderDetails').post(authMiddleware,async(req,res)=>{

    const newOrder=new ordersModel();

    newOrder.orderBy.username=req.validUser.username
    newOrder.orderBy.email=req.validUser.email
    newOrder.userId=req.validUser._id
    
    newOrder.productdetails.productname=req.body.productname
    newOrder.productdetails.price=req.body.price
    newOrder.productdetails.quantity=req.body.quantity
    newOrder.productdetails.paymentmode=req.body.paymentmode
    newOrder.productdetails.productLink=req.body.productLink
    newOrder.productdetails.cartid=req.body.cartid,
    newOrder.productdetails.itemid=req.body.itemid

    newOrder.address.username=req.body.username
    newOrder.address.phone=req.body.phone
    newOrder.address.house_number=req.body.house_number
    newOrder.address.city=req.body.city

    newOrder.save().then(data=>{
        // console.log(data);

        return res.status(201).send({status:'success',data})
    }).catch(e=>{
        return res.status(500).send({status:'failed',e})

    })
});

Router.route('/getAllOrders').get(async(req,res)=>{
    ordersModel.find({}).then(data=>{
        console.log(data)
        return res.status(200).send(data)
    }).catch(e=>{
        return res.status(500).send({Error:'failed'})

    })
});


Router.route('/getMyorder/:userid').get(authMiddleware,async(req,res)=>{
     console.log(req.validUser._id)
    // console.log(ordersModel.orderBy)
    ordersModel.find({userId:req.validUser._id}).then(data=>{
        console.log(data)
        return res.status(200).send(data)
    }).catch(e=>{
        return res.status(500).send({Error:'failed'})

    })
})

Router.route('/editOrder/:id').patch(async(req,res)=>{

    ordersModel.findByIdAndUpdate(req.params.id).then(data=>{
        // console.log(data)
        data.productdetails={
            productname:req.body.productname,
            price:req.body.price,
            quantity:req.body.quantity?req.body.quantity:1,
            paymentmode:req.body.paymentmode,
            productLink:req.body.productLink,
            cartid:req.body.cartid?req.body.cartid:'Direct order',
            itemid:req.body.itemid
        }

        data.address={
            username:req.body.username,
            phone:req.body.phone,
            house_number:req.body.house_number,
            city:req.body.city
        }

        data.save().then(d=>{
            // console.log(d);
            return res.status(201).send({status:'Update success',data})
        }).catch(e=>{
            return res.status(500).send({status:'Update Failed',e})
        })

    }).catch(e=>{

        return res.status(500).send({status:'Update Failed',e})

    })
})

module.exports=Router

