
import React from "react";
import { Navigate, Outlet } from "react-router";
import {useDispatch,useSelector} from 'react-redux';

const ProtectedRoute =({authenticated})=>{
  const {authenticate,myInfo} = useSelector(state=>state.auth);
  console.log("redux auth: ",myInfo);

        return (
           authenticated || authenticate ? <Outlet context={[myInfo]} />
          : <Navigate to="/messenger/login" replace/>
           
        );
        
      }

export default ProtectedRoute;