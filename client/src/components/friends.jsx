import React from "react";
import moment from 'moment';
import {RiCheckboxCircleFill } from "react-icons/ri";
import {HiOutlineCheckCircle } from "react-icons/hi";

const Friends = ({friend,activeUser,myId,msgInfo})=>{

    
    return (
        <div className='friend'>
            <div className="friend-image">
                <div className="image">
                    <img src={`./uploads/images/${friend.image}`} alt="frind-img" />
                    {
                        activeUser && activeUser.length > 0 && activeUser.some(u => u === friend._id) ? <div className="active_icon"></div> : ''
                    }
                </div>
            </div>
            
            <div className="friend-name-seen">
                <div className="friend-name">
                    <h4 className>{friend.userName}</h4>
                    <div className="msg-time">
                        {
                         //   msgInfo && msgInfo.senderId === myId ? <span>You </span> : <span className={msgInfo?.senderId !== myId &&  msgInfo?.status !== undefined && msgInfo?.status !== 'seen'?'unseen_message':'' }>{friend.userName + ' '}</span>
                        }
                        {

                        }
                        {
                          //  msgInfo && msgInfo.message.text ? <span className={msgInfo?.senderId !== myId &&  msgInfo?.status !== undefined && msgInfo?.status !== 'seen'?'unseen_message':'' }>{msgInfo.message.text.slice(0, 10)}</span> : msgInfo && msgInfo.message.image ? <span>send a image</span> : <span>connect you</span>
                        }
                         <span>{ /*msgInfo ? moment(msgInfo.createdAt).startOf('mini').fromNow() : moment(friend.createdAt).startOf('mini').fromNow()*/}</span>
                    </div>
                </div>
                {

myId === msgInfo?.senderId ?
    <div className="seen-unseen-icon">

        {/*
            msgInfo.status === 'seen' ?
                <img src={`./image/${friend.image}`} alt="" /> : msgInfo.status === 'delivared' ? <div className="delivared"><RiCheckboxCircleFill /></div> : <div className='unseen'><HiOutlineCheckCircle /></div>
       */ }
    </div> :
    <div className="seen-unseen-icon">
        {
           // msgInfo?.status !== undefined && msgInfo?.status !== 'seen' ? <div className="seen-icon"></div> : ''
        }

    </div>
}
            </div>

        </div>
    )
}
export default Friends;