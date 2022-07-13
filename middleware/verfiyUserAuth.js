const jwt = require("jsonwebtoken");
const{ThrowError}= require('../utils/ErrorResponse');

exports.verfiyUserAuth = (req,res,next)=>{ 
    try{
        const token = req.cookies._token;

        if(!token){
            throw new Error('access denied');
        }

       const verfied= jwt.verify(token,process.env.TOKEN_SECRET);

       if(!verfied){
          throw new Error('something went wrong try again! ');
       }
       //console.log("from middleware: ",verfied);
            req.user = {};
            req.user.id=verfied.id;
            req.user.email=verfied.email;
            req.user.userName=verfied.userName;

            next();
    }catch(err){
        return res.status(500).json({
            success:false,
            error:err.message
        })
    }
}