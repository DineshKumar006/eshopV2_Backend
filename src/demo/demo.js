const jwt =require('jsonwebtoken');


const _id="5ee39da7de0c2a9400061b5b"
const token=jwt.sign({_id:_id.toString()},'eshopping', {expiresIn:'1d'})


console.log(token);



const isMatch=jwt.verify(token,'eshopping')

console.log(isMatch)