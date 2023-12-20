import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    SUCCESS_MESSAGE_CLEAR,
    ERROR_CLEAR,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    IS_AUTHENTICATED,
    IS_NOT_AUTHENTICATED
    } from "../types/authType";

const authState = {
    loading : true,
    authenticate : false,
    error : '',
    successMessage : '',
    myInfo : ''
}

export const authReducer = (state =  authState,action)=>{
    
    const{payload,type} = action;

    if(type === REGISTER_SUCCESS){
         return{
            ...state,
            successMessage : payload.successMessage,
            error : '',
            authenticate : true,
            loading : false
        }
    }
    if(type === REGISTER_FAIL || type === USER_LOGIN_FAIL){
        return {
            ...state,
            error : payload.error,
            authenticate : false,
            myInfo : '',
            loading : true
        }
    }

    if(type === USER_LOGIN_SUCCESS){
       const myInfo =  JSON.parse(localStorage.getItem('userInfo'));
        return{
            ...state,
            myInfo : payload.myInfo,
            successMessage : payload.successMessage,
            error : '',
            authenticate : true,
            loading : false
        }
    }
    if(type === SUCCESS_MESSAGE_CLEAR){
        return{
            ...state,
            successMessage : ''
        }
    }
    if(type === ERROR_CLEAR){
        return{
            ...state,
            error : ''
        }
    }
    if(type === IS_AUTHENTICATED){
        return{
            ...state,
            myInfo : payload.myInfo,
            successMessage : payload.successMessage,
            error : '',
            authenticate : true,
            loading : false
        }
    }
    if(type === IS_NOT_AUTHENTICATED){
        return {
            ...state,
            error : payload.error,
            authenticate : false,
            myInfo : '',
            loading : true
        }
    }
    if(type === 'LOGOUT_SUCCESS'){
        return {
            ...state,
            authenticate: false,
            myInfo : '',
            successMessage : 'Logout successfully'
        }
    }

    return state;
}
