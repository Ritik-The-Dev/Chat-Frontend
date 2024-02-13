import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useRef, useState } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from 'next/dynamic'
import { PhotoShow } from "../common/PhotoShow";
import { HOST } from "@/utils/ApiRoutes";
const VoiceMessage = dynamic(()=>import("./VoiceMessage"),{ssr:false})

function ChatContainer() {
  const[{messages,currentChatUser,userInfo}] = useStateProvider()
  const [showPhotoBigger, setshowPhotoBigger] = useState(undefined);
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Scroll to the bottom of the chat container whenever messages update
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return <div
  ref={containerRef} className="h-[80vh] bg-bg-whitesmoke w-full flex-grow overflow-auto custom-scrollbar">
    <div className="h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
    <div className="mx-10 my-6 relative bottom-0 z-0 left-0 ">
      <div className="flex w-full">
        <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
          {
            messages.map((message,index)=>(
              (
                <div key={message.id} className={` flex ${message.senderId === currentChatUser.id ? "justify-start":"justify-end"}`}>
                  {message.type==="text" && (
                    <div className={ `text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end lg:max-w-[45%] md:max-w-[45%] ${message.senderId=== currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
                    <span className=" break-all">{message.message}</span>
                    <div className="flex gap-1 item-end">
                      <span className=" text-bubble-meta text-[11px] pt-1 min-w-fit">
                        {
                          calculateTime(message.createdAt)
                        }
                      </span>
                      <span>
                        {
                          message.senderId===userInfo.id &&  <MessageStatus messageStatus={message.messageStatus}/>
                        }
                      </span>
                    </div>
                    </div>
                  )}
                  {message.type === "image" && <ImageMessage message={message}
                  onClick={() =>
                    setshowPhotoBigger(`${`${HOST}/${message.message}`}`)
                  }/>}
                  {message.type === "audio" && <VoiceMessage message={message}/>}
                  </div>
              )
            ))
          }
        </div> 
        </div>
      </div>
      {showPhotoBigger && (
        <>
        <PhotoShow
          width={"32%"}
          showPhotoBigger={showPhotoBigger}
          setshowPhotoBigger={setshowPhotoBigger}
        />
        </>
      )}
  </div>
}

export default ChatContainer;
