import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import {ImAttachment} from "react-icons/im"
import { MdSend } from "react-icons/md";
import {FaMicrophone} from "react-icons/fa"
import { useStateProvider } from "@/context/StateContext";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGES_ROUTE } from "@/utils/ApiRoutes";
import axios from 'axios'
import { reducerCases } from "@/context/StateContext";
import EmojiPicker from 'emoji-picker-react'
import PhotoPicker from "../common/PhotoPicker";
import dynamic from "next/dynamic"
const CaptureAudio = dynamic(()=>import("../common/CaptureAudio"),{ssr:false});
function MessageBar() {

  const[{userInfo,currentChatUser,socket},dispatch] = useStateProvider()
  const[message,setMessage] = useState("")
  const[showEmojiPicker,setShowEmojiPicker] = useState(false)
  const [grabPhoto, setGrabPhoto] = useState(false)
  const[showAudioRecorder,setShowAudioRecorder] = useState(false);

  const emojiPickerRef = useRef(null)

  useEffect(()=>{
    const handleOutsideClick = (event)=>{
      if(event.target.id !== "emoji-open"){
        if(emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)){
          setShowEmojiPicker(false)
        }
      }
    }
    document.addEventListener("click",handleOutsideClick)
    return()=>{
      document.removeEventListener("click",handleOutsideClick)
    }
  },[])

  const handleEmojiModal = ()=>{
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiClick = (emoji)=>{
      setMessage((prevMessage)=>(prevMessage+=emoji.emoji))
  }

  const SendMessage = async()=>{
    try{
      const{data} = await axios.post(ADD_MESSAGES_ROUTE,{
        to:currentChatUser?.id,
        from:userInfo?.id,
        message
      })
      socket.current.emit("send-msg",{
        to:currentChatUser?.id,
        from:userInfo?.id,
        message:data.message,
      });
      dispatch({
        type:reducerCases.ADD_MESSAGE,
        newMessage:{
         ...data.message
        },
        fromSelf:true
      })
      setMessage("")
    }
    catch(err){
      console.log(err)
    }
  }

  const photoPickerChange = async(e)=>{
    try{
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image",file);
      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE,formData,{
        headers:{
          "Content-Type":"multipart/form-data",
        },
        params:{
          from:userInfo?.id,
          to: currentChatUser?.id,
        }
      });
      if(response.status === 201){
        socket.current.emit("send-msg",{
          to:currentChatUser?.id,
          from:userInfo?.id,
          message:response.data.message,
        });
        dispatch({
          type:reducerCases.ADD_MESSAGE,
          newMessage:{
           ...response.data.message
          },
          fromSelf:true
        })
      }
    }
    catch(err){
      console.log("Error",err)
    }
}
useEffect(()=>{
  if(grabPhoto){
    const data = document.getElementById('photo-picker')
    data.click()
    document.body.onfocus= (e)=>{
      setTimeout(()=>{
        setGrabPhoto(false)
      },1000)
    }
  }
},[grabPhoto])

  return <div className=" bg-gray-200 h-20 px-4 flex items-center gap-6 relative">
    {
      !showAudioRecorder && 
    <>
    <div className="flex gap-6 ">
      <BsEmojiSmile
      className=" text-black cursor-pointer text-xl"
      title="Emoji"
      id= "emoji-open"
      onClick={handleEmojiModal}
      />
            {showEmojiPicker && (
              <div
                className="absolute bottom-24 lg:left-16 z-40 left-1"
                ref={emojiPickerRef}
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
      <ImAttachment
       className=" text-black cursor-pointer text-xl"
       title="Attachment"
       onClick={()=> setGrabPhoto(true)}/>
    </div>
    <div className="w-full rounded-lg h-10 flex items-center">
      <input type="text" placeholder="Type a Message" className=" bg-gray-500 text-sm focus:outline-none text-white h-10 px-5 rounded-lg py-4 w-full"
      value={message} onChange={(e)=>setMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          SendMessage();
        }
      }}/>
    </div>
    <div className="flex w-10 items-center justify-center">
    <button>
      {
        message.length ? (
        <MdSend
        className=" text-black cursor-pointer text-xl"
        title="send message"
        onClick={SendMessage}/>):(
        <FaMicrophone
        className=" text-black cursor-pointer text-xl"
        title="record"
        onClick={()=>setShowAudioRecorder(true)}/>    
        )
      }
      </button>
    </div>
    </>
}
  {grabPhoto && <PhotoPicker onChange={photoPickerChange}/>}
  {showAudioRecorder && <CaptureAudio onChange={setShowAudioRecorder}/>}
  </div>
}

export default MessageBar;
