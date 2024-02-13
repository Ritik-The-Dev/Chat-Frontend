import { useStateProvider } from "@/context/StateContext"; // Importing custom state provider
import React from "react";
import Image from 'next/image'; // Importing Next.js Image component for image optimization
import { reducerCases } from "@/context/StateContext"; // Importing reducer cases for state management

function IncomingVideoCall() {
  // Accessing application state and dispatch function
  const [{ incomingVideoCall, socket }, dispatch] = useStateProvider();

  // Function to accept the incoming video call
  const acceptCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: { ...incomingVideoCall, type: "in-coming" },
    });
    socket.current.emit("accept-incoming-call", { id: incomingVideoCall.id });
    dispatch({
      type: reducerCases.SET_INCOMING_VIDEO_CALL,
      incomingVideoCall: undefined
    });
  }

  // Function to reject the incoming video call
  const rejectCall = () => {
    socket.current.emit("reject-video-call", { from: incomingVideoCall.id });
    dispatch({ type: reducerCases.END_CALL });
  }

  // Rendering the incoming video call UI
  return (
    <div className="h-24 w-80 fixed bottom-8 mb-0 gap-5 p-4 right-6 z-50 rounded-sm items-center justify-start flex text-white bg-conversation-panel-background drop-shadow-2xl border-icon-green border-2 py-14">
      <div>
        <Image
          src={incomingVideoCall.profilePicture}
          alt="avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      <div>
        <div>{incomingVideoCall.name}</div>
        <div className="text-xs">Incoming Video Call</div>
        <div className="flex gap-2 mt-2">
          {/* Button to reject the call */}
          <button className="bg-red-500 p-1 px-3 text-sm rounded-full" onClick={rejectCall}>
            Reject
          </button>
          {/* Button to accept the call */}
          <button className="bg-green-500 p-1 px-3 text-sm rounded-full" onClick={acceptCall}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingVideoCall;
