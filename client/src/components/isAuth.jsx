import React, { useState,useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const IsAuth = ({isLoggedin,children})=>{

    if(isLoggedin===undefined || !isLoggedin){
      return <Navigate to="/landing" replace />;
    }
    return children;
}
export default IsAuth;