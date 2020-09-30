const express = require('express');
const app = express();
require('dotenv').config()

app.get('/api/test',(req,res)=>{
    res.send({msg: 'is working'});
})
console.log();
app.listen(process.env.PORT,()=>{
    console.log(`listening to port ${process.env.PORT}`)
})