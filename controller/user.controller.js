const User = require("../model/User");


exports.getUser = async (req,res,next)=>{
    try {
        const {
            id
        } = req.body;
        const user = await User.findById(id).select("-password -__v");
        if(!user){
            throw new Error("user not found");
        }

        return res.status(200).json({
            success:true,
            data:user
        });

    } catch (err) {
        return res.status(500).json({
            success:false,
            error:err.message
        })
    }
}

exports.getAllUsers = async (req,res,next)=>{
    try {
      
        const users = await User.find({}).select("-password -__v");
        if(!users){
            throw new Error("no users");
        }

        return res.status(200).json({
            success:true,
            data:users
        });

    } catch (err) {
        return res.status(500).json({
            success:false,
            error:err.message
        })
    }
}
