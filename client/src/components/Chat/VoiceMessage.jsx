import { useStateProvider } from "@/context/StateContext";
import React, { useEffect ,useRef,useState} from "react";
import {FaPlay, FaStop } from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import { HOST } from "@/utils/ApiRoutes";
import Avatar from "../common/Avatar";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";

function VoiceMessage({message}) {

  const[{currentChatUser,userInfo}] = useStateProvider()
  const [totalDuration, setTotalDuration] = useState(0);
  const [audioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);

  const waveFormRef = useRef(null)
  const waveForm = useRef(null)

  useEffect(() => {
    const audioUrl = `${HOST}/${message.message}`;
    const audio = new Audio(audioUrl);
    let isMounted = true;
    if (isMounted) {
      setAudioMessage(audio);
    }
    try{
      if (isMounted && waveForm.current) {
        waveForm.current.load(audioUrl);
        waveForm.current.on("ready", () => {
          setTotalDuration(waveForm.current.getDuration());
        });
      }
    }
    catch(err){
      console.log(err)
    }
    return () => {
      isMounted = false;
    };
  }, [message.message, waveForm.current]);
  
  useEffect(()=>{
    if(audioMessage){
      const updatePlaybackTime = ()=>{
        setCurrentPlayBackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate",updatePlaybackTime)
      return()=>{
        audioMessage.removeEventListener("timeupdate",updatePlaybackTime)
      }
    }
  },[audioMessage])
  
  useEffect(()=>{
    if(waveForm.current === null){
      waveForm.current = WaveSurfer.create({
        container:waveFormRef.current,
        waveColor:"#ccc",
        progressColor:"#4a9eff",
        cursorColor:"#7ae3c3",
        barWidth:2,
        height:30,
        responsive:true,
      })  
      waveForm.current.on("finish",()=>{
        setIsPlaying(false)
      })
  
      return ()=>{
        waveForm.current.destroy()
      }
    }
  },[])

  const handlePlayAudio = ()=>{
    if(audioMessage){
      waveForm.current.stop()
      waveForm.current.play()
      audioMessage.play()
      setIsPlaying(true)
    }
  }

  const handlePauseAudio = ()=>{
    waveForm.current.stop()
    audioMessage.pause()
    setIsPlaying(false)
  }

  const formatTime = (time)=>{
    if(isNaN(time)) return "00:00";
    const minutes = Math.floor(time/60)
    const seconds = Math.floor(time%60)
    return `${minutes.toString().padStart(2,"0")}:${
      seconds.toString().padStart(2,"0")
    }`
  }

  return     <div className={`flex items-center gap-2 overflow-auto text-white px-4 pr-2 py-4 text-sm rounded-md ${message.senderId === currentChatUser._id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
  <div className="cursor-pointer text-xl overflow-auto">
    {
      isPlaying ?
      (<FaStop onClick={handlePauseAudio}/>) :
      (<FaPlay onClick={handlePlayAudio}/>)
    }
  </div>
  <div className="relative overflow-auto">
    <div className="w-48" ref={waveFormRef}/> {/* Waveform visualization */}
    <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
      <span>{formatTime(isPlaying ? currentPlayBackTime : totalDuration)}</span> {/* Current playback time or total duration */}
      <div className="flex gap-1"></div>
      <span>{calculateTime(message.createdAt)}</span> {/* Timestamp */}
      {
        message.senderId === userInfo._id && <MessageStatus messageStatus={message.messageStatus}/> // Displaying message status for current user's messages
      }
    </div>
  </div>
</div>
}

export default VoiceMessage;