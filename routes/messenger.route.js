const express = require('express');
const router = express.Router();

const{
    allFriends,
    sendMessage,
    getMessage,
    sendImage,
    getLastMessage
} = require('../controller/messenger.controller');

//middleware 
const{
verfiyUserAuth,

} = require('../middleware/verfiyUserAuth');
/*
router.route().post((req,res,next)=>{

});
*/
router.route('/').get((req,res,next)=>{
verfiyUserAuth(req,res,next);
},(req,res,next)=>{
    return res.json({
        "userAuth":{
            "userName":req.user.userName,
            "email":req.user.email,
            "id":req.user.id
        }
    });
});

router.route('/friend/all').get((req,res,next)=>{
    verfiyUserAuth(req,res,next);
},(req,res,next)=>{
    allFriends(req,res,next);
});

router.route('/message/send').post((req,res,next)=>{
    verfiyUserAuth(req,res,next);
},(req,res,next)=>{
    sendMessage(req,res,next);
});

router.route('/image/send').post((req,res,next)=>{
    verfiyUserAuth(req,res,next);
   //next()
},(req,res,next)=>{
    sendImage(req,res,next);
});

router.route('/message/:id').get((req,res,next)=>{
    verfiyUserAuth(req,res,next);
    //next();
},(req,res,next)=>{
    getMessage(req,res,next);
});

module.exports = router;