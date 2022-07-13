
const allMessages = new Map();

export const addNewSocketMessage = (msg,fromUser,toUser,type)=>{
   
    if(!fromUser||!toUser){
        return;
    }

    const newMessage ={
            senderId:type==='send'?fromUser:toUser,
            reciverId:type==='send'?toUser:fromUser,
            message:{
                text:msg,
                image:''
            },
            date:Date.now()
    }
    if(!allMessages.has(fromUser+''+toUser)){
        allMessages.set(fromUser+''+toUser,[newMessage]);
    }else{
        allMessages.get(fromUser+''+toUser).push(newMessage);
    }
//  allMessages.set(124+''+123,[{msg:"helllo"}])
};

export const getScoketConversation = (key)=>{
   // console.log("whole socket converence: ",allMessages)
    if(!allMessages.has(key))
        return;
    const conversation = Array.from(allMessages.get(key));
    return conversation;
};

