import { useStateProvider } from "@/context/StateContext"; // Importing useStateProvider hook from StateContext
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes"; // Importing ADD_AUDIO_MESSAGE_ROUTE from ApiRoutes
import React, { useEffect, useRef, useState } from "react"; // Importing React, useEffect, useRef, and useState from react package
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa"; // Importing icons from react-icons/fa
import { MdSend } from "react-icons/md"; // Importing MdSend icon from react-icons/md
import WaveSurfer from "wavesurfer.js"; // Importing WaveSurfer library
import axios from "axios"; // Importing axios for making HTTP requests
import { reducerCases } from "@/context/StateContext"; // Importing reducerCases from StateContext

function CaptureAudio({ onChange }) {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider(); // Using useStateProvider hook to access state
  const [isRecording, setIsRecording] = useState(false); // State variable for recording status
  const [isPlaying, setIsPlaying] = useState(false); // State variable for playing status
  const [recordedAudio, setRecordedAudio] = useState(null); // State variable for recorded audio
  const [waveForm, setWaveForm] = useState(null); // State variable for waveform
  const [recordingDuration, setRecordingDuration] = useState(0); // State variable for recording duration
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0); // State variable for current playback time
  const [totalDuration, setTotalDuration] = useState(0); // State variable for total duration
  const [renderAudio, setRenderAudio] = useState(null); // State variable for rendered audio
  const audioRef = useRef(null); // Ref for audio element
  const mediaRecordedRef = useRef(null); // Ref for recorded media
  const waveFormRef = useRef(null); // Ref for waveform element

  // Effect hook to update recording duration
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  // Effect hook to initialize WaveSurfer instance
  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });
    setWaveForm(wavesurfer);

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  // Effect hook to handle recording
  useEffect(() => {
    if (waveForm) handleStartRecording();
  }, [waveForm]);

  // Function to handle start recording
  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlayBackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudio(null);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecordedRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;
        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          setRecordedAudio(audio);

          waveForm.load(audioUrl);
        };

        mediaRecorder.start();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Function to handle stop recording
  const handleStopRecording = () => {
    if (mediaRecordedRef.current && isRecording) {
      mediaRecordedRef.current.stop();
      setIsRecording(false);
      waveForm.stop();

      const audioChunks = [];
      mediaRecordedRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecordedRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRecordedAudio(audioFile);
      });
    }
  };

  // Effect hook to update playback time
  useEffect(() => {
    if (audioRef.current) {
      const updatePlaybackTime = () => {
        setCurrentPlayBackTime(audioRef.current.currentTime);
      };

      audioRef.current.addEventListener("timeupdate", updatePlaybackTime);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener(
            "timeupdate",
            updatePlaybackTime
          );
        }
      };
    }
  }, [audioRef.current, setCurrentPlayBackTime]);

  // Function to handle playing recording
  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveForm.stop();
      waveForm.play();
      setIsPlaying(true);
    }
  };

  // Function to handle pausing recording
  const handlePauseRecording = () => {
    waveForm.stop();
    setIsPlaying(false);
  };

  // Function to send recording
  const sendRecording = async()=>{
    try{
      const formData = new FormData();
      formData.append("audio",recordedAudio);
      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE,formData,{
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
        onChange()
      }
    }
    catch(err){
      console.log("Error",err)
    }
  }

  // Function to format time
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex text-2xl w-screen justify-end items-center">
      <div className="pt-1">
        <FaTrash
          className="text-panel-header-icon"
          onClick={() => onChange()}
        />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-xl flex gap-3 items-center justify-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-500 animate-pulse 2-60 text-center">
            Recording <span>{recordingDuration}</span>
          </div>
        ) : (
          <div className="">
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-20" ref={waveFormRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlayBackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
      </div>
      <div className="mr-4">
        {!isRecording ? (
          <FaMicrophone
            className="text-red-500"
            onClick={handleStartRecording}
          />
        ) : (
          <FaPauseCircle
            className="text-red=500"
            onClick={handleStopRecording}
          />
        )}
      </div>
      <div className="">
        <MdSend
          className="text-panel-header-icon cursor-pointer mr-4"
          title="Send"
          onClick={sendRecording}
        />
      </div>
    </div>
  );
}

export default CaptureAudio;
