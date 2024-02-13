import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import {BsFillChatLeftTextFill,BsThreeDotsVertical} from 'react-icons/bs'
import { reducerCases } from "@/context/StateContext";
import { useRouter } from "next/router";
function ChatListHeader() {

  const router  = useRouter()
  const[{userInfo},dispatch] = useStateProvider()
  const handleAllContactsPage = ()=>{
    dispatch({type:reducerCases.SET_ALL_CONTACTS_PAGE })
  }

  const handleProfile = ()=>{
    router.push('/profile')
  }
  
  return <div className="flex items-center justify-center w-full lg:h-[8rem]">
    <div className="h-16 px-4 py-1 flex justify-between items-center w-full lg:bg-bg-whitesmoke lg:w-[50%]">
    <div className=" cursor-pointer" onClick={handleProfile}>
    <Avatar type="sm" image={userInfo?.profilePicture ? userInfo?.profilePicture : "/default_avatar.png"}/>
    </div>
    <div className="flex gap-6">
      <BsFillChatLeftTextFill
      className=" text-panel-header-icon cursor-pointer text-xl "
      title="New Chat"
      onClick={handleAllContactsPage}/>
      <>
      <BsThreeDotsVertical
      className=" text-panel-header-icon cursor-pointer text-xl "
      title="Menu"
      />
      </>
    </div>
    </div>
  </div>
}

export default ChatListHeader;
