import React, { useEffect } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/StateContext"; // Importing reducer cases for state management
import { useRouter } from "next/router";

function ChatLIstItem({data}) {
  const router = useRouter()
   
  const[{userInfo,currentChatUser},dispatch] = useStateProvider() // Accessing state and dispatch function

  // Function to handle clicking on the contact's name
  const handleContactClick = ()=>{
      dispatch({type:reducerCases.CHANGE_CURRENT_CHAT_USER,user:{...data}}) // Dispatching an action to change the current chat user
  }


  return (
    <div className={`flex items-center cursor-pointer hover:bg-gray-100`}>
      {/* Profile picture */}
      <div className="px-5 min-w-fit pt-3 pb-1">
        <Avatar key={data?.id} type="lg" image={data?.profilePicture}/>
      </div>
      {/* Contact details */}
      <div className="min-h-full flex flex-col w-full justify-center mt-3 pr-2" onClick={handleContactClick}>
        <div className="flex justify-between">
          {/* Contact name */}
          <div>
            <span className=" text-black ">{data?.name}</span>
          </div>
        </div>
        {/* Summary */}
        <div className="flex border-b border-conversation-border pb-2 pt-1 pr-2">
          <div className="flex justify-between w-full">
            <span className=" text-secondary line-clamp-1 text-sm">
              {/* Checking if the contact has a summary */}
              {data?.Summary || "\u00A0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatLIstItem;
