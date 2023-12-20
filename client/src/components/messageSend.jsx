import React from "react";

import { RiGalleryLine } from 'react-icons/ri';
import {AiFillGift} from 'react-icons/ai';
import {BiMessageAltEdit} from 'react-icons/bi';
import {BsPlusCircle} from 'react-icons/bs';

const emojis = [
    '❤️️', '😃', '😄', '😁',
    '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃',
    '😉', '😌', '😍', '😝',
    '😜', '🧐', '🤓', '😎',
    '😕', '🤑', '🥴', '😱',
    '😭', '😥', '👍', '💪'
];

const MessageSend = ({handleInput,newMessage,sendMessage,sendImage,sendEmoji,handleKeyUP})=>{

    return (
        <div className='message-send-section'>
            <input type="checkbox" id='emoji' />
            <div className="file hover-attachment">
                <div className="add-attachment">
                    Add Attachment
                </div>
                <BsPlusCircle />
            </div>
            <div className="file hover-image">
                <div className="add-image">
                    Add Image
                </div>
                <input onChange={sendImage}  type="file" id='pic' className="form-control" />
                <label htmlFor="pic"><RiGalleryLine /></label>
            </div>
          
           
            <div className="message-type">
                <input onChange={handleInput} onKeyUp={handleKeyUP} value={newMessage} type="text" name='message' id='message' placeholder='Aa'  className="form-control" />
                <label htmlFor="emoji">🙂</label>
            </div>
            <div onClick={sendMessage} className="file">
              ↗️
            </div>
            <div className="emoji-section">
                <div className="emoji">
                    {
                        emojis.map((e,index) => <span key={index} onClick={() => sendEmoji(e)}> {e} </span>)
                    }
                </div>
            </div>
        </div>
    );
}

export default MessageSend ;