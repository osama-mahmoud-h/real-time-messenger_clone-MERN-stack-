import axios from 'axios';
import React, { useState,useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route, Link , Navigate, Outlet, useNavigate} from 'react-router-dom';
import Login from './components/login';
import Messenger from './components/messenger';
import Register from './components/register';
import {useDispatch,useSelector} from 'react-redux';
import {isUserAuth} from './store/actions/authAction';
import ProtectedRoute from './components/protectedRoute';
import { FaLastfmSquare } from 'react-icons/fa';
import LoadingSpinner from './components/loadingSpinner';

const App = () => {

 const [userInfo,setUserInfo] = useState(null);
 const [loading,setLoading] = useState(true);
 const [authenticate,setAuthenticate] = useState(false);

 useEffect( ()=>{   
 axios.get('/api/messenger/user/isAuth')
 .then(resp=>{
  console.log("userInfo data: ",resp.data.data)
  setUserInfo(resp.data.data);
  setAuthenticate(true)
  setLoading(false)
 })
 .catch(err=>{
  setLoading(false)
 });
  console.log("is Authenticate after",authenticate);
 },[]);
 
 console.log("is Authenticate",authenticate);
  return(
   <>
   {
   loading ? <LoadingSpinner/>
   :
   <Router>
   <Routes>
   <Route path='/messenger/login' element={<Login/>}></Route>
   <Route path='/messenger/register' element={<Register/>}></Route>
 
   <Route  element = { <ProtectedRoute authenticated={authenticate}/> }>
     <Route exact path='/' element={<Messenger userInfo={userInfo}/>}/>
   </Route>

 </Routes>    
</Router>
   }
  
   </>
  );
};



export default App ;
