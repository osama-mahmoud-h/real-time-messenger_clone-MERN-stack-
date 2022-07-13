const mongoose = require('mongoose');

//BD_CLOUD_URI
//BD_LOCAL_URL
const connectDB = ()=>{
    mongoose.connect(process.env.BD_CLOUD_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
   }).then(succ=>console.log("mongodb Connected succefully"))
   .catch(err=>console.log(err));
 }
 
 module.exports = connectDB;
