import React, { useEffect, useState } from "react";
import { useStateProvider } from "@/context/StateContext";
import Input from "@/components/common/Input";
import Avatar from "@/components/common/Avatar";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/StateContext";
import axios from 'axios'
import { useRouter } from "next/router";
function onboarding() {
  const router = useRouter()
  const [{userInfo,newUser},dispatch] = useStateProvider()
  const[name,setName] = useState(userInfo?.name || "")
  const[about,setAbout] = useState("")
  const[image,setImage] = useState("/default_avatar.png")

  useEffect(()=>{
    if(!newUser && !userInfo?.email) router.push("/login")
    else if(!newUser && userInfo?.email) router.push("/")
  
  },[newUser,userInfo,router])

  const validateDetails = ()=>{
    if(name.lenght<3){
      return false
    }
    return true
  }

  const onboardUserHandler = async()=>{
    if(validateDetails){
      const email = userInfo.email;
      try{
          const {data} = await axios.post(ONBOARD_USER_ROUTE,{
            email,
            name,
            about,
            image
          })
          if(data.status){
            dispatch({type:reducerCases.SET_NEW_USER,newUser:false })
            dispatch({
              type:reducerCases.SET_USER_INFO,userInfo:{
                id:data.user.id,
                name,
                email,
                profileImage:image,
                status:about,    
              }
            })
            router.push("/")
          }
      }
      catch(err){
        console.log(err)
      }
    }
  }
  return <div className=" bg-white h-screen w-screen text-white flex flex-col items-center justify-center">
    <div className="flex items-center justify-center gap-2">
    </div>
    <h2 className="text-2xl text-black">Create Your Profile</h2>
    <br />
    <div>
        <Avatar type="xl" image={image} setImage={setImage}/>
      </div>
    <div className="flex gap-6 mt-6">
      <div className="flex flex-col items-center justify-center mt-5 gap-6">
        <Input name="Display Name" state={name} setState={setName} label/>
        <Input name="About" state={about} setState={setAbout} label/>
        <div className="flex items-center justify-center">
          <button className="flex items-center justify-center gap-7 p-5 bg-search-input-container-background rounded-lg hover:bg-gray-500"
          onClick={onboardUserHandler}>
            Create Profile
          </button>
        </div>
      </div>
    </div>
  </div>;
}

export default onboarding;
