
import{
FRIENDS_GET_SUCCESS,
MESSAGE_GET_SUCCESS,
MESSAGE_SEND_SUCCESS,
UPDATE_FRIEND_MESSAGE,
MESSAGE_SEND_SUCCESS_CLEAR,
DELIVARED_MESSAGE,
SEEN_MESSAGE,
UPDATE,
MESSAGE_GET_SUCCESS_CLEAR
} from '../types/messengerType';

const messengerState = {
    friends : [],
    message : [],
    messageSendSuccess : false,
    message_get_success : false,
    themeMood : '',
    new_user_add : ''
}

export const messengerReducer = (state=messengerState , action) =>{

    const{type,payload} = action ;

    if(type === FRIENDS_GET_SUCCESS){
        return {
            ...state,
            friends : payload.friends
        }
    }

    if(type === MESSAGE_GET_SUCCESS){
        return {
            ...state,
            message_get_success : true,
            message : payload.message
        }
    }
    
    if(type === MESSAGE_SEND_SUCCESS){
        return {
            ...state,
            messageSendSuccess : true,
            message : [...state.message,payload.message]
        }
    }

    return state;
}