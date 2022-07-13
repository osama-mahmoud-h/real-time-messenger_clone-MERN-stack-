import React, { useState ,useEffect} from "react";
import { Link ,useNavigate} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import {userRegister} from '../store/actions/authAction';
import {useAlert} from 'react-alert';
import {SUCCESS_MESSAGE_CLEAR,ERROR_CLEAR} from '../store/types/authType'
const Register  = ()=>{
    const navigate = useNavigate();
    const alert = useAlert();
    const {loading,successMessage,error,authenticate,myInfo} = useSelector(state=>state.auth);
    console.log("reducer info: ",successMessage)
    const dispatch = useDispatch();

    const [userInfo,setUserInfo] = useState({
        userName : '',
        email : '',
        password : '',
        confirmPassword : '',
        image : ''
    });
    const [loadImage,setLoadImage] = useState('');

    const inputHendle = (e) =>{
        setUserInfo({
            ...userInfo,
            [e.target.name] : e.target.value
        })
    }

//hndle file
    const handleFile = (e)=>{
console.log("file handle.....");
        if(e.target.files.length !==0){
            setUserInfo({
                ...userInfo,
                [e.target.name] : e.target.files[0]
            }) 
        }
        const reader = new FileReader();
        reader.onload = ()=>{
            setLoadImage(reader.result);
        
        }
        reader.readAsDataURL(e.target.files[0]);
    }

//handle register
  const handleRegister = (e)=>{
   e.preventDefault();
   const {userName,email,password,image,confirmPassword} = userInfo;  
   
   const formData = new FormData();
   formData.append('userName',userName);
   formData.append('email',email);
   formData.append('password',password);
   formData.append('confirmPassword',confirmPassword);
   formData.append('image',image);
   
   //dispatch action
   dispatch(userRegister(formData));
  // console.log(userInfo)
  }  
console.log("successssss:",successMessage);
  useEffect(() => {
     if(successMessage){
         console.log("registered successfully")
         alert.success(successMessage);
         dispatch({type:SUCCESS_MESSAGE_CLEAR})
         navigate('/messenger/login');

     }
     if(error){
          alert.error(error);
         dispatch({type : ERROR_CLEAR})
     }
  }, [successMessage,error]);

    return(
        <div className="register">
        <div className="card">
            <div className="card-header">
                <h3>Register</h3>
            </div>
            <div className="card-body">
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="username">User Name</label>
                        <input type="text"  name="userName" onChange={inputHendle} value={userInfo.userName} className="form-control" placeholder="user name" id="username"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" onChange={inputHendle} value={userInfo.email}  name='email' className="form-control" placeholder="email" id="email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name = 'password'  onChange={inputHendle} value={userInfo.password}  className="form-control" placeholder="password" id="password"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input type="password" name ='confirmPassword' onChange={inputHendle} value={userInfo.confirmPassword}  className="form-control" placeholder="confirm password" id="confirmPassword"/>
                    </div>
                    <div className="form-group">
                        <div className="file-image">
                            <div className="image">
                                {loadImage ? <img src={loadImage}/>:'' }
                            </div>
                            <div className="file">
                                <label htmlFor="image">Select Image</label>
                                <input type="file" onChange={handleFile} name="image" className="form-control" id="image"/>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="register" className="btn"/>
                    </div>
                    <div className="form-group">
                        <span><Link to="/messenger/login">Login Your Account</Link></span>
                    </div>
                </form>
            </div>
        </div>
    </div>
    );
}
export default Register;
