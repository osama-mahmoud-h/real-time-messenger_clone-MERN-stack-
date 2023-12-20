const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
userName:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
image:{
    type:String,
    required:true
},
timestamp:{
    type:Date,
    default:Date.now()
}
});


const User = mongoose.model('User',userSchema);

module.exports = User ;