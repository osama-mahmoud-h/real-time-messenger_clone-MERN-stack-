import { Response } from "express";

// Base response interface
interface BaseResponse {
  status: string;
  message: string;
}

// Success response interface, extending the base response
interface SuccessResponse extends BaseResponse {
  data?: any;
}

// Error response interface, extending the base response
interface ErrorResponse extends BaseResponse {
  data?: any | null
}

// Utility function to send success response
export function sendSuccessResponse(
  res: Response,
  statusCode: number,
  message: string,
  data?: any|null
) {
  const response: SuccessResponse = {
    status: "success",
    message,
    data
  };

  return res.status(statusCode).json(response);
}

// Utility function to send error response
export function sendErrorResponse(
  res: Response,
  statusCode: number,
  message: string,
  data?: any | null
) {
  const response: ErrorResponse = {
    status: "false",
    message,
    data
  };

  return res.status(statusCode).json(response);
}

export const sendInternalServerError = (res:Response):any=>{
  return sendErrorResponse(res,500,"Internal Server Erorr");
}
