import {React, useState,useEffect} from 'react';
import {userLogin} from '../store/actions/authAction';
import { Link ,Navigate,useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { ERROR_CLEAR, SUCCESS_MESSAGE_CLEAR } from "../store/types/authType";

const Login = () => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, successMessage, error, authenticate, myInfo } = useSelector(state => state.auth);

    const [userInfo, setUserInfo] = useState({
        phone: '',
        password: ''
    });
    const handleInput = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(userLogin(userInfo))
    }

    useEffect(() => {
        if(successMessage){
            alert.success(successMessage);
            dispatch({type:SUCCESS_MESSAGE_CLEAR})
          //  window.location.reload();
            navigate('/');
        
        }
        if(error){
             alert.error(error);
            dispatch({type : ERROR_CLEAR})
        }
    }, [successMessage, error])

    return (
        <>

        <div className="login">
        <div className="card">
            <div className="card-header">
                <h3>Login</h3>
            </div>
            <div className="card-body">
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input onChange={handleInput} type="email" placeholder="email" value={userInfo.email} name="email" id="email" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input onChange={handleInput} value={userInfo.password} type="password" name="password" id="password" placeholder="password" className="form-control" />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Login" className="btn" />
                    </div>
                    <div className="form-group">
                        <span><Link to="/messenger/forgot-password">Forgot Password ?</Link></span>
                    </div>
                    <div className="form-group">
                        <span><Link to="/messenger/register">Register Your Account</Link></span>
                    </div>
                </form>
            </div>
        </div>
    </div>
       
      
        </>
    );
};

export default Login;
