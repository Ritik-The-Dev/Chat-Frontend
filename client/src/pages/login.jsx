import React, { useEffect, useState } from "react";
import Image from 'next/image'
import {FcGoogle} from 'react-icons/fc'
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE, GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/StateContext";
import { Audio } from 'react-loader-spinner'

function login() {
  const router = useRouter()
  const [loading,setLoading] = useState(false)
  const [{userInfo,newUser},dispatch] = useStateProvider();

  useEffect(()=>{
    if(userInfo?.id && !newUser) router.push("/")
  },[userInfo,newUser])

  const handleLogin =async ()=>{
    const provider = new GoogleAuthProvider()
    const {user:{displayName:name,email,photoURL:profileImage}} = await signInWithPopup(firebaseAuth,provider)
    
    try{
      if(email){
        const {data} = await axios.post(CHECK_USER_ROUTE,{email});
        if(!data.status){
          dispatch({type:reducerCases.SET_NEW_USER,newUser:true })
          dispatch({
            type:reducerCases.SET_USER_INFO,userInfo:{
              name,
              email,
              profileImage,
              status:" ",
            }
          })
          router.push("/onboarding")
        } 
        else{
          const {id,name,email,profilePicture:profileImage,status} = data.data
          dispatch({
            type:reducerCases.SET_USER_INFO,userInfo:{
              id,name,email,profilePicture:profileImage,status
            }
          })
          router.push("/")
        }
      }
    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    const getContacts = async () => {
      setLoading(true)
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS);
        users && setLoading(false)
    } catch (error) {
        setLoading(false)
        console.error("Error fetching contacts:", error);
      }
    };

    getContacts();
  }, []);

  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      {
        loading ? (
          <div className="flex flex-col items-center justify-center w-full h-screen">
          <Audio
          height="80"
          width="80"
          radius="9"
          color={`white`}
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
        /><h1 className="text-white text-2xl ml-10">Loading Backend...</h1></div>
        ) : (
          <>
          <div className="flex items-center justify-center gap-2 text-white ">
      <Image src='/whatsapp.gif' alt='Whatsapp' height={300} width={300}/>
      </div>
      <button className="flex items-center justify-center gap-7 p-5 bg-search-input-container-background rounded-lg" onClick={handleLogin}>
        <FcGoogle className="text-4xl"/>
        <span className="text-2xl text-white">Login with Google</span>
      </button>
      </>
        )
      }
    </div>
  )
}

export default login;
