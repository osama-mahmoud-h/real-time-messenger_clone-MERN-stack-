const formidable = require('formidable');
const validator = require('validator');
const User = require('../model/User');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.register = async(req,res,next)=>{
    try {
        const formData = formidable();

        const formFields = await new Promise((fill,reject)=>{
            formData.parse(req,async(err,fields,files)=>{
                if(err){
                    reject("something went wrong");
                    return;
                }
                fill({
                    fields,
                    files
                });
            });
        });

        const{
            userName,
            email,
            password,
            confirmPassword,
        } = formFields.fields;
        const {image} = formFields.files;
        if(!userName||!email||!password||!confirmPassword||!image){
            throw new Error('you should provide all fileds');
        }
        if(!validator.isEmail(email)){
            throw new Error('not valid email'); 
        }
        if(password !== confirmPassword){
            throw new Error("password mismatch");
        }
        if(password.length<6){
            throw new Error("password must be more than or equal 6 ");
        }


         //check if user Exists already
         const oldUser = await User.findOne({email:email});
         if(oldUser){
             throw new Error("this email already token try diffrent one");
         }

        if(image){
            //generate random number
            const random = Math.floor(Math.random()*10e9);
            //new unique name
            image.newFilename =  random+image.originalFilename;
            //new path
            const newPath  = __dirname+'/../client/build/uploads/images/'+image.newFilename;

            const fileCopying = await new Promise((fill,reject)=>{
            fs.copyFile(image.filepath,newPath,(err)=>{
                if(err)
                  reject("image uploading error");
                  fill("copied successfully");
            })
           });
        }
       
        //hash password
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = User({
            userName:userName,
            email:email,
            password:hashedPassword,
            image : image.newFilename
        });

        const saveUser = await newUser.save();

        return res.status(200).json({
            success:true,
            message:"User Signed in Successfully",
            data:{
                "userName":saveUser.userName,
                "email":saveUser.email,
                "image":saveUser.image,
                "id":saveUser._id
            }
        });

    } catch (err) {
         return res.status(500).json({
            success:false,
            error:err.message
        });
    }
}

exports.login = async(req,res,next)=>{
  //  return res.json({"endpoint":"nnnn"})
    try {
        const{
            email,
            password
        } = req.body;
      //  return res.json("kkkk")

        if(!email){
            throw new Error('you should provide email')
        }
        if(!password){
            throw new Error('you should provide password')
        }
        const user = await User.findOne({email:email});
      //  console.log("user__ ",user)
        if(!user){
            throw new Error('User Not Found');
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            throw new Error('invalid credentials');
        }

        const payload = {
            id:user._id,
            userName:user.userName,
            email:user.email 
        }

        const token = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            {expiresIn:"5d"},
            (err,token)=>{
               if(err){
                  return res.status(500).json({
                      success:false,
                      error:"something went wrong!"
                  });
               }
               res.cookie("_token",token, {
                  maxAge:5000*60*60*24,// 1day
                  httpOnly: true,
                  //secure: true, // only works on https
                });

                return res.status(200).json({
                    success:true,
                    message:"user loggedin successfully",
                    data:{
                      "userName":user.userName,
                      "email":user.email,
                      "id":user._id,
                      "image":user.image,
                    }
                });

            });



    } catch (err) {
        return res.status(500).json({
            success:false,
            error:err.message
        });        
    }
  
}

exports.logout = async (req,res,next)=>{
    try{
        res.clearCookie('_token');
        return res.status(201).json({
           success:true,
           message:"logged out succefully"
        });
     }catch(err){
        return res.status(401).json({
           success:false,
           error:err.message
        });
     }
}

exports.userInfo = async (req,res,next)=>{
  
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        
        return res.status(200).json({
            success:true,
            message:"user found",
            data:{
              "userName":user.userName,
              "email":user.email,
              "id":user._id,
              "image":user.image,
            }
        });

    } catch (err) {
        return res.status(500).json({
            success:false,
            error:"user not found"
        }); 
    }
}

