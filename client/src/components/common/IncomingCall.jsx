import { useStateProvider } from "@/context/StateContext";
import React from "react";
import Image from 'next/image'
import { reducerCases } from "@/context/StateContext";

function IncomingVoiceCall() {
  // Accessing application state and dispatch function
  const[{incomingVoiceCall,socket},dispatch] = useStateProvider()

  // Function to accept an incoming call
  const acceptCall = ()=>{
    // Dispatching action to set up the voice call and informing server about call acceptance
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: { ...incomingVoiceCall, type: "in-coming" },
    });
    socket.current.emit("accept-incoming-call", { id: incomingVoiceCall.id });
    // Clearing incoming call notification
    dispatch({
      type: reducerCases.SET_INCOMING_VOICE_CALL,
      incomingVoiceCall: undefined
    });
  }

  // Function to reject an incoming call
  const rejectCall = ()=>{
    // Informing server about rejecting the call and ending the call
    socket.current.emit("reject-voice-call", { from: incomingVoiceCall.id });
    dispatch({ type: reducerCases.END_CALL });
  }

  // Rendering incoming call notification
  return (
    <div className="h-24 w-80 fixed bottom-8 mb-0 gap-5 p-4 right-6 z-50 rounded-sm items-center justify-start flex text-white bg-conversation-panel-background drop-shadow-2xl border-icon-green border-2 py-14">
      {/* Displaying caller's profile picture */}
      <div>
        <Image
          src={incomingVoiceCall.profilePicture}
          alt="avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      {/* Displaying caller's name and notification type */}
      <div>
        <div>{incomingVoiceCall.name}</div>
        <div className="text-xs">Incoming Voice Call</div>
        {/* Buttons to accept or reject the call */}
        <div className="flex gap-2 mt-2">
          <button className=" bg-red-500 p-1 px-3 text-sm rounded-full" onClick={rejectCall}>
            Reject
          </button>
          <button className=" bg-green-500 p-1 px-3 text-sm rounded-full" onClick={acceptCall}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingVoiceCall;
