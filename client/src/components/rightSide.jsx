import React, { useState } from "react";
import { BsCameraVideoFill } from 'react-icons/bs'
import { HiDotsCircleHorizontal } from 'react-icons/hi'
import { IoCall } from 'react-icons/io5'
import FriendInfo from "./friendInfo";
import LoadingSpinner from "./loadingSpinner";
import Message from "./message";
import MessageSend from "./messageSend";
import { Vedio } from "./vedio";


const RightSide = (props)=>{

    const{
        currentfriend,
        handleInput,
        newMessage,
        sendMessage,
        message,
        scrollRef,
        sendEmoji,
        sendImage,
        typingMessage,
        handleKeyUP,
        activeUser,
        userInfo,
        convernceLoading,
       
        
    } = props;

    const[vedioChoosed,setVedioChoosed] = useState(false);
    const chooseVedio=(e)=>{
        console.log("vedio choosed");
        setVedioChoosed(true);
    }
   //console.log("is vedio choosed? ",vedioChoosed)
    return (
        <div className='col-8 '>
            <div className="right-side">
                <input type="checkbox" id='dot' />
                
                <div className="row">
                    <div className="col-12 ">
                        <div className="message-send-show">
                            <div className="header d-flex justify-content-end">

                                <div className="back-ward">
                                <label htmlFor="go-back-arrow"> ⬅️ </label>    
                                </div>
                                <div className="image-name">
                                        
                                    <div className="image">
                                        <img src={`./uploads/images/${currentfriend.image}`} alt="current-friend" />
                                            {
                                                activeUser && activeUser.length > 0 && activeUser.some(u => u.userId === currentfriend._id) ? <div className="active-icon"></div> : ''
                                            }

                                    </div>
                                    <div className="name">
                                        <h3> {currentfriend.userName}</h3>
                                    </div>
                                </div>
                                
                                <div className="icons">
                                    <div className="icon">
                                        <IoCall />
                                    </div>
                                    <div className="icon">
                                     <BsCameraVideoFill  />
                                          
                                    </div>
                                </div>

                            </div>
                            {
                            convernceLoading? <LoadingSpinner/>
                            :
                            <Message 
                            myInfo={userInfo} 
                            currentfriend={currentfriend} 
                            scrollRef={scrollRef} 
                            message={message}
                            typingMessage={typingMessage}
                           
                             />
                            
                            }
                              
                               <MessageSend
                               sendMessage={sendMessage} 
                               handleInput={handleInput}
                               newMessage={newMessage}
                               sendEmoji={sendEmoji}
                               sendImage={sendImage}
                               handleKeyUP={handleKeyUP}
                               />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default RightSide ; 