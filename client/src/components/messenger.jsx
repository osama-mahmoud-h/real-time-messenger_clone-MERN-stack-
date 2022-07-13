import {React,useEffect,useState,useRef, useContext} from "react";
import LoadingSpinner from './loadingSpinner';
import {BsThreeDots} from 'react-icons/bs';
import {IoIosLogOut} from 'react-icons/io';
import {FaEdit} from 'react-icons/fa';
import {BiSearch} from 'react-icons/bi';
import ActiveFriend from "./activeFriend";
import Friends from "./friends";
import RightSide from "./rightSide";
import {useDispatch,useSelector} from 'react-redux';
import {getFriends,getMessage,messageSend,ImageMessageSend} from '../store/actions/messengerAction';
import {io as socketio} from 'socket.io-client';
import Peer from 'simple-peer';
import {addNewSocketMessage,getScoketConversation} from './socketMessages';
import { useNavigate, useOutletContext } from "react-router";
import { userLogout } from "../store/actions/authAction";

var userInfo = null;
const Messenger = (props)=>{
   // const socketMessages = 
   const [myInfo] = useOutletContext();
   const navigate = useNavigate();
   userInfo = props.userInfo||myInfo;
   
    const socket = useRef();
  //  console.log("on flay userInfo:  ",userInfo)
    const scrollRef = useRef();

    const currentFriendRef = useRef({
        userName:"",
        _id:"",
        email:"",
        image:""
    });
    const dispatch = useDispatch();
     
   // const {friends} = useSelector(state=>state.messenger);

    const [currentFriend,setCurrentFriend] = useState({
        userName:"",
        _id:"",
        email:"",
        image:""
    });
    const [typingMessage,setTypingMessage] = useState('');
    const [scoketConversation,setScoketConversation]=useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [friendsLoading,setFriendsLoading] =useState(true);
    const [userLoading,setUserLoading] =useState(false);
    const [convernceLoading,setConvernceLoading] =useState(true);
    const [activeUsers, setActiveUsers] = useState(null);
    const [allFriends, setAllFriends] = useState([]);
    const [filterFriends, setFilterFriends] = useState([]);
 
   

    const handleInput = (e)=>{
        setNewMessage(e.target.value);
        socket.current.emit('typingMessage',{
            senderId: userInfo.id,
            recieverId: currentFriend._id,
            message: e.target.value
        });
    }

  //handle key up event
  const onKeyUP = (e)=>{
      console.log("key up");
      setTypingMessage.message='';
      //setTypingMessage('');
  } 
  
//handle send message
    const sendMessage = (e) => {
        e.preventDefault();
        if(newMessage.length === 0)
           return;
        const data = {
            senderId:userInfo.id,
            senderName: userInfo.userName,
            recieverId: currentFriend._id,
            message: newMessage
        }
        console.log("private message to: ",currentFriend.userName)
        socket.current.emit("sendPrivateMessage",data);
        setNewMessage('');
        setTypingMessage('');
    }

//handle send emoji
    const sendEmoji = (emoji)=>{
        setNewMessage(`${newMessage}`+emoji);
    }

//handle send images
    const sendImage = (e)=>{
        if (e.target.files.length !== 0) {
           // sendingSPlay();
            const imagename = e.target.files[0].name;
            const newImageName = Date.now() + imagename;
           // var stream =ss.createStream();
            const formData = new FormData();

            formData.append('senderName', userInfo.userName);
            formData.append('senderId', userInfo.id);
            formData.append('recieverId', currentFriend._id);
            formData.append('image', e.target.files[0]);

            const reader = new FileReader();
           // reader.readAsDataURL(e.target.files[0]);
            reader.readAsArrayBuffer(e.target.files[0])
            reader.onload = ()=>{
               // setLoadImage(reader.result);

             //  console.log('imagesbuffer , ',reader.result );
             //   socket.current.emit("file_uploading" ,reader.result);
            }
           dispatch(ImageMessageSend(formData));
           const data = {
            senderId:userInfo.id,
            senderName: userInfo.userName,
            recieverId: currentFriend._id,
           
        }
           socket.current.emit("sendPrivateMessage",data);

        }
    }

//search users
const searchUsers = (e)=>{
    
    setFilterFriends(
        allFriends.filter(fr=>{
            return fr.userName.includes(e.target.value)
        })
    );
   // socket.current.emit("getFriends",userInfo.id);
}

//set current friend
const setCurrentFriendRef = (fr)=>{
    console.log("set cur frnd reffervnce    ",fr)
    currentFriendRef.current = fr;
}

//logout
const logout = () => {
    dispatch(userLogout());
    socket.current.emit('logout', myInfo.id);
  
    //reloading
    window.location.reload(false);
}

// socketio client handle
useEffect(() => {
    socket.current = socketio('/');
}, []);

useEffect(()=>{
setTypingMessage('');
//console.log("mongodb convers :",scoketConversation)
},[scoketConversation]);

useEffect(() => {
    //add this user to socket
   // socket.current.emit("add_new_user",userInfo);

    socket.current.on("greeting",()=>{
    socket.current.emit("myDataBaseId",userInfo);
    socket.current.emit("getFriends",userInfo.id);
        console.log("greeeeeting");
    });

    //get friends
   

    socket.current.on("getFriends_success",(frnds)=>{
        setAllFriends(frnds);
        setFilterFriends(frnds);
        setFriendsLoading(false);
    });

    socket.current.on("message-sent-success",(data)=>{
        console.log("message-sent-seccess eveent")
        socket.current.emit("getConversation",{
            senderId : data.senderId,
            recieverId : data.recieverId
        });
    });

    socket.current.on('Messages-Get-Success',(data)=>{
      
        console.log("message recieve curr ",currentFriendRef.current._id," ",currentFriendRef.current.userName," ",
        data.senderId !== userInfo.id && currentFriendRef.current._id !== data.senderId, " ",
        currentFriendRef.current._id,"   ", data.senderId)

   
        if(data.senderId !== userInfo.id && currentFriendRef.current._id !== data.senderId){
         
        }else{
            setScoketConversation(data.message);
        }
       
        setConvernceLoading(false);   
       
    });

    socket.current.on("typingMessageGet",data=>{
        setTypingMessage(data);
       // console.log("typing")
    });

    //get active users
    socket.current.on("get_active_users",(data)=>{
        setActiveUsers(data);
        console.log("active users",data)
    });

}, []);

    useEffect(() => {
        if (allFriends && allFriends.length > 0) {
            currentFriendRef.current = allFriends[0];
            setCurrentFriend(allFriends[0]);
           // setAllFriends(friends)

            console.log("current friend[0]: ",allFriends[0]._id," me: ",userInfo.id)
            socket.current.emit("getConversation",{
                senderId : userInfo.id,
                recieverId : allFriends[0]._id
            });
            console.log("mongodb convers .. :",scoketConversation)
          

        }

    }, [allFriends]);

    useEffect(() => {
        if(currentFriend._id){
            console.log("cur frnd id: ",currentFriend._id)
            socket.current.emit("getConversation",{
                senderId : userInfo.id,
                recieverId : currentFriend._id
            });
        }
      
    }, [currentFriend?._id]);

    useEffect(() => {
         scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [scoketConversation]);

    return(
<>
{
    userLoading?<LoadingSpinner/>
    :
    <div className='messenger '>
        <input type="checkbox" id='go-back-arrow' />
    <div className="row">
        <div className="col-4">
            <div className="left-side">
                <div className="top">
                    <div className="image-name">
                        <div className="image">
                            <img src={`./uploads/images/${userInfo.image}`} alt="current" />
                        </div>
                        <div className="name">
                            <h3>{userInfo.userName}</h3>
                        </div>
                    </div>
                    <div className="icons">
                        <div className="icon logout" onClick={logout}>    
                            <IoIosLogOut />
                        </div>
                    </div>
                </div>
                <div className="friend-search">
                    <div className="search">
                        <button><BiSearch/></button>
                        <input onChange={searchUsers} type="text" placeholder='search' className="form-control" />
                    </div>
                </div>
                {/*<div className="active-friends">
                    {
                        activeUser && activeUser.length > 0 ? activeUser.map(u => <ActiveFriend setCurrentFriend={setCurrentFriend} user={u} />) : ''
                    }

                </div>*/}
                <div className="friends">
                    <label htmlFor="go-back-arrow">
                    {
                                filterFriends && filterFriends.length > 0 ? 
                                filterFriends.map((fd,index) => <div key={index} className={!currentFriend._id?fd._id:"hover-friend active"}  onClick={() =>{setCurrentFriend(fd); setCurrentFriendRef(fd);} } >
                                    
                                 <Friends 
                                  friend={fd}
                                  activeUser={activeUsers}
                                  myId={userInfo.id}
                                  msgInfo={scoketConversation[scoketConversation.length-1]}
                                  />
                                </div>) :(friendsLoading?<LoadingSpinner/>:'no friend') 
                }
                    </label>
                </div>
            </div>
        </div>
         {
             currentFriend._id ?
              <RightSide 
              currentfriend={currentFriend}
              handleInput={handleInput}
              newMessage={newMessage}
              sendMessage={sendMessage}
              message={scoketConversation}
              scrollRef={scrollRef}
              sendEmoji={sendEmoji}
              sendImage={sendImage}
              typingMessage={typingMessage}
              handleKeyUP={onKeyUP}
              activeUser={activeUsers}
              userInfo={userInfo}
              convernceLoading={convernceLoading}
             

              /> :(convernceLoading? <div> <LoadingSpinner/> </div>: "select friend")
         }
    </div>
   
  </div>
}

</>
);
}
export default Messenger;
