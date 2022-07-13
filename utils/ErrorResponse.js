
exports.ThrowError = (res,statusCode,errMessage)=>{
    return res.status(statusCode).json({
        success:false,
        error:errMessage
    });
}