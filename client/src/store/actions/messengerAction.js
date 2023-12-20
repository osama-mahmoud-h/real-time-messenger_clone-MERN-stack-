import axios from 'axios';
import {
    FRIENDS_GET_SUCCESS,
    MESSAGE_SEND_SUCCESS,
    MESSAGE_GET_SUCCESS
} from '../types/messengerType';

export const getFriends = ()=>async(dispatch)=>{
    try {
        const resp = await axios.get('/api/messenger/friend/all');
        //console.log("firnds: ",resp.data.data);
        dispatch({
            type : FRIENDS_GET_SUCCESS,
            payload : {
                friends : resp.data.data
            }
        });
    } catch (err) {
        console.log("friends error: ",err.response.data.error);
    }
}

export const messageSend = (data) => async(dispatch)=>{
    try {
        const resp = await axios.post('/api/messenger/message/send',data);
        console.log("send message:  ",resp.data.data);
        dispatch({
            type : MESSAGE_SEND_SUCCESS,
            payload : {
                message : resp.data.data
            }
        })
    } catch (err) {
        console.log("err from send msg: ",err.response.data);
    }
}


export const getMessage = (id) =>{
    return async(dispatch)=>{
        
        try {
            const resp = await axios.get(`/api/messenger/message/${id}`);
            console.log("msg get success: ",resp.data.data);

            dispatch({
                type :MESSAGE_GET_SUCCESS,
                payload : {
                    message : resp.data.data
                }
            })
        } catch (err) {
            console.log("msg get err: ",err.response.data);
        }
    }
}

export const ImageMessageSend = (data) =>async(dispatch)=>{

    try {
        const resp = await axios.post('/api/messenger/image/send',data);
        console.log("img send suc: ",resp.data.data)
        dispatch({
            type : MESSAGE_SEND_SUCCESS,
            payload : {
                message : resp.data.data
            }
        })
    } catch (err) {
        console.log("img send err: ",err.response.data)
    }
    
}