const ordersModel=require('../models/ordersModel');
const Router=require('express').Router()
const authMiddleware=require('../middleware/authmiddleware')
// const stripe = require('stripe')("sk_test_51GvGvEGPcs7DKbrChu69gb5ovzAQ8R2xXn1zB0ZZw9cbcfAhEnwFJFrBbcrIaffwhmifXAfdANS4Ua8ta5LkWGUG00pypms6tg")

const Stripe = require('stripe')
const stripe = new Stripe("sk_test_51GvGvEGPcs7DKbrChu69gb5ovzAQ8R2xXn1zB0ZZw9cbcfAhEnwFJFrBbcrIaffwhmifXAfdANS4Ua8ta5LkWGUG00pypms6tg")


const { v4: uuidv4 } = require('uuid');



Router.route('/newPayment').post( authMiddleware,async(req,res)=>{


    const amount=req.body.amount
const {paymentMethod}=req.body.Cardpayload
// console.log(req.body.payload)
// console.log(req.validUser)
// console.log(paymentMethod.billing_details)
    try {
        await ordersModel.generateMail(req.validUser.email,req.body.payload)

        const newOrder=new ordersModel();

        newOrder.orderBy.username=req.validUser.username
        newOrder.orderBy.email=req.validUser.email
        newOrder.userId=req.validUser._id
        
        newOrder.productdetails.productname=req.body.payload.productname
        newOrder.productdetails.price=req.body.payload.price
        newOrder.productdetails.quantity=req.body.payload.quantity
        newOrder.productdetails.paymentmode=req.body.payload.paymentmode
        newOrder.productdetails.productLink=req.body.payload.productLink
        newOrder.productdetails.cartid=req.body.payload.cartid,
        newOrder.productdetails.itemid=req.body.payload.itemid
    
    
        newOrder.onlinepayment.customerpaymentid=paymentMethod.id,
        newOrder.onlinepayment.paymentmode=paymentMethod.card.brand +" "+paymentMethod.type
    
        newOrder.address.username=req.body.payload.username
        newOrder.address.phone=req.body.payload.phone
        newOrder.address.house_number=req.body.payload.house_number
        newOrder.address.city=req.body.payload.city
        await newOrder.save()

        
        const paymentIntent= await stripe.paymentIntents.create({
            amount,
            currency:'inr',
            metadata: {integration_check: 'accept_a_payment'},

        })
        
         console.log(paymentIntent.client_secret)
         
     return  res.status(200).send(paymentIntent.client_secret)

    } catch (error) {
      return  res.status(500).send(error)
      
    }


})




Router.route('/orderSuccess').post(authMiddleware, async(req,res)=>{
    // console.log(req.body)

    
try {

    await ordersModel.generateMail('brightseeeds@gmail.com',req.validUser.email,req.body.payload)

    const {token,product,address}=req.body
    const customer=await stripe.customers.create({
        name:address.username,
        email:token.email,
        source:token.id
    })
    // console.log(customer.id)

    const newOrder=new ordersModel();

    newOrder.orderBy.username=req.validUser.username
    newOrder.orderBy.email=req.validUser.email
    newOrder.userId=req.validUser._id
    
    newOrder.productdetails.productname=req.body.payload.productname
    newOrder.productdetails.price=req.body.payload.price
    newOrder.productdetails.quantity=req.body.payload.quantity
    newOrder.productdetails.paymentmode=req.body.payload.paymentmode
    newOrder.productdetails.productLink=req.body.payload.productLink
    newOrder.productdetails.cartid=req.body.payload.cartid,
    newOrder.productdetails.itemid=req.body.payload.itemid


    newOrder.onlinepayment.customerpaymentid=customer.id,
    newOrder.onlinepayment.paymentmode=token.card.brand +" "+token.card.object

    newOrder.address.username=req.body.payload.username
    newOrder.address.phone=req.body.payload.phone
    newOrder.address.house_number=req.body.payload.house_number
    newOrder.address.city=req.body.payload.city
    await newOrder.save()






    const idempotencyKey=uuidv4()

    const charge=await stripe.charges.create({
        amount:(product.price+product.extracharges+product.gst)*100,
        // id:"",
        customer:customer.id,
        currency:"INR",
        receipt_email:token.email,
        description:product.itemType,
       
    },{idempotencyKey})


    return res.send('success')

} catch (error) {

    // console.log('charge',{error})
    return res.send('failed')
}

   
})



Router.route('/addorderDetails').post(authMiddleware,async(req,res)=>{


    await ordersModel.generateMail(req.validUser.email,req.body)


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

    newOrder.onlinepayment.customerpaymentid=null,
    newOrder.onlinepayment.paymentmode="COD"

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
});


Router.route('/deleteAllOrder').delete(async(req,res)=>{
    ordersModel.deleteMany({}).then(data=>{
        return res.status(400).send("delete success")
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

