
exports.successReponse = (res,statusCode,message,data)=>{
    return res.status(statusCode).json({
        success:true,
        message:message,
        data:data
    });
}