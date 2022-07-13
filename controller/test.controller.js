
const formidable = require('formidable');

exports.test = async(req,res,next)=>{

    try {
       const form = formidable();

      var formFields = await new Promise((fill,reject)=>{
        form.parse(req,async(err,fields,files)=>{
            if(err){
                reject("something went wrong");
                return;
            }
            /* return res.status(200).json({
                 success:success,
                 message:"formidable parsing succ"
             });*/
             fill({
                 "fields":fields,
                "files":files
                });
            
         });
      });
    
    //hash password
  /*  const hashedPassword =   
    // finnaly create new user 
    const newUser = User({
        userName:userName,
        email:email,
        password:password,

    })*/
        
       return res.status(200).json({
            success:true,
            message:"successed",
            data:formFields.files
        });

    } catch (err) {
       return res.status(500).json({
            success:false,
            error:err
        });
    }
}