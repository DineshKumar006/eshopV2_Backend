const express=require('express');
const http =require('http');
const app=express();
const cors=require('cors')
const bodyParser=require('body-parser')
require('./src/db/db')
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const server=http.createServer(app)
const PORT=process.env.PORT || 8080

const userRoute=require('./src/routes/userRoute')
const imageRoute=require('./src/routes/productRouter')
const cartRoute=require('./src/routes/cartRouter');
const ordersRoute=require('./src/routes/ordersRoute');

app.use('/users',userRoute)
app.use('/products',imageRoute)
app.use('/cartData',cartRoute)
app.use('/orders',ordersRoute)


server.listen(PORT,()=>{
    console.log('Servering runnning on Port:',PORT);  
})