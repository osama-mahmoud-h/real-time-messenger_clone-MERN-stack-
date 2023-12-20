const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId:{
        type:String,
        index:true,
        required:true
    },
    senderName:{
        type:String,
        required:true
    },
    recieverId:{
        type:String,
        index:true,
        required:true
    },
    message : {
        text : {
            type : String,
            default : ''
        },
        image : {
            type : String,
            default : ''
        }
    },
    status : {
        type : String,
        default : 'unseen'
    }
},{timestamps : true});


const Message = mongoose.model('Message',messageSchema);

module.exports = Message ;