import React, { useEffect, useRef } from "react";
import {IoClose} from 'react-icons/io5'

function CapturePhoto({setImage,hide}) {

  useEffect(()=>{
    let stream ;
    const startCamera = async ()=>{
      stream = await navigator.mediaDevices.getUserMedia({
        video:true,
        audio:false
      })
      videoRef.current.srcObject = stream
    }
    startCamera()
    return()=>{
      stream?.getTracks().forEach((track)=>track.stop())
    }
  })
  const capturePhoto = ()=>{
    const canvas = document.createElement("canvas");
    canvas.getContext("2d").drawImage(videoRef.current,0,0,300,150);
    setImage(canvas.toDataURL("image/jpeg"))
    hide(false)
  }
  const videoRef = useRef(null)

  return <div className=" absolute md:h-4/6 md:w-2/6 lg:h-4/6 lg:w-2/6 left-[0.333%] md:top-1/4  top-[16%] lg:top-1/4 md:left-1/3 lg:left-1/3 bg-gray-900 gap-3 rounded-lg pt-2 flex items-center justify-center">
    <div className="flex flex-col gap-4 w-full items-center justify-center">
    <div className="pt-2 pr-2 cursor-pointer flex items-end justify-end" 
    onClick={() => hide(false)}>
        <IoClose className="h-10 w-10 cursor-pointer"/>
      </div>
      <div className="flex justify-center ">
        <video id="video" width="400" autoPlay ref={videoRef}></video>
      </div>
      <button className=" h-16 w-16 bg-white rounded-full cursor-pointer border-8 p-2 mb-10 border-teal-light"
      onClick={capturePhoto}>

      </button>
    </div>
  </div>
}

export default CapturePhoto;
