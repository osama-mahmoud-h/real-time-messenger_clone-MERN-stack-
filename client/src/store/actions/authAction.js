import axios from 'axios';
import {
    REGISTER_FAIL, 
    REGISTER_SUCCESS,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    IS_AUTHENTICATED,
    IS_NOT_AUTHENTICATED
} from '../types/authType'

export const userRegister = (data)=>{
    return async(dispatch)=>{

        const config = {
                headers: {
                    'Content-Type': 'application/josn'
                }
        }
        
        try {
            const resp = await axios.post('/api/messenger/user/register',data,config);
            console.log("register resp suc ",resp.data.message)
         //  localStorage.setItem('userInfo',JSON.stringify(resp.data.data));

         dispatch({
             type:REGISTER_SUCCESS,
             payload:{
                successMessage:resp.data.message
             }
         })
        } catch (err) {
            console.log("resp err ",err.response.data.error)
            dispatch({
                type:REGISTER_FAIL,
                payload:{
                    error : err.response.data.error
                }
            })
        }
    }
} 

export const userLogin = (data) => {
    return async (dispath) => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const resp = await axios.post('/api/messenger/user/login', data, config);

           // console.log("login resp suc ",resp.data.message);
         //   localStorage.setItem('userInfo',JSON.stringify(resp.data.data));

            dispath({
                type: USER_LOGIN_SUCCESS,
                payload: {
                    successMessage: resp.data.message,
                    myInfo:resp.data.data
                }
            });
        } catch (err) {
            dispath({
                type: USER_LOGIN_FAIL,
                payload: {
                    error:  err.response.data.error
                }
            });
        }
    }
}

//user logout
export const userLogout = ()=>async(dispatch)=>{
    try {
        const response = await axios.get('/api/messenger/user/logout');
        if(response.data.success){
            dispatch({
                type : 'LOGOUT_SUCCESS',
            })
        }
    } catch (err) {
        console.log("user logout error: ", err.response.data.error)
    }
}

//is userAuth?
export const isUserAuth = ()=>{
    return async (dispath)=>{
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const resp = await axios.get('/api/user/isAuth',config);
            
            console.log("is authendd resp suc ",resp.data);

            dispath({
                type: IS_AUTHENTICATED ,
                payload: {
                    successMessage: resp.data.message,
                    myInfo:resp.data.data
                }
            });

        } catch (err) {
            dispath({
                type: IS_NOT_AUTHENTICATED ,
                payload: {
                    error:  err.response.data.error
                }
            });
        }
    }
}