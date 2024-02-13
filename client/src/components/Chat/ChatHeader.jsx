import React, { useState } from "react";
import Avatar from "../common/Avatar"; // Importing Avatar component
import {MdReport} from 'react-icons/md'; // Importing MdCall icon from react-icons/md
import { useStateProvider } from "@/context/StateContext"; // Importing useStateProvider from StateContext
import { reducerCases } from "@/context/StateContext"; // Importing reducerCases from StateContext
import { IoMdArrowRoundBack } from "react-icons/io"; // Importing IoMdArrowRoundBack icon from react-icons/io
import axios from 'axios'

function ChatHeader() {
  const [{currentChatUser,userInfo}, dispatch] = useStateProvider(); // Destructuring state variables from StateContext

  // Function to handle back button
  const handleBack = () => {
    // Dispatching action to change current chat user and set all contacts page
    dispatch({ type: reducerCases.CHANGE_CURRENT_CHAT_USER, currentChatUser: undefined });
    dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-white z-10">
      <div className="flex items-center justify-center gap-2">
        <div
          className="flex justify-end items-center w-[12%] text-5xl cursor-pointer"
          onClick={handleBack}
        >
          <IoMdArrowRoundBack className="cursor-pointer text-xl text-black" />
        </div>
        {/* Displaying the chat user's avatar */}
      <Avatar type="sm" image={currentChatUser?.profilePicture}/>
        <div className="flex flex-col w-full">
          <span className="text-black">{currentChatUser?.name}</span>
          <span className="text-black text-sm">online/offline</span>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
