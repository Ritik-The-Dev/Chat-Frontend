import React, {useState } from "react";
import { useStateProvider } from "@/context/StateContext";
import Input from "@/components/common/Input";
import Avatar from "@/components/common/Avatar";
import { useRouter } from "next/router";
import { EDIT_USER_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/StateContext";
import axios from 'axios'
import { IoMdArrowRoundBack } from "react-icons/io";
function profile() {
    const router = useRouter()
    const [{userInfo},dispatch] = useStateProvider()
    const[name,setName] = useState(userInfo?.name)
    const[about,setAbout] = useState(userInfo?.about)
    const[image,setImage] = useState(userInfo?.profilePicture)

    const editUserHandler = async()=>{
        if(name.length > 3){
          try{
              const {data} = await axios.put(`${EDIT_USER_ROUTE}/${userInfo?.id}`,{
                name,
                about,
                image
              })
              if(data.status){
                dispatch({type:reducerCases.SET_NEW_USER,newUser:false })
                dispatch({
                  type:reducerCases.SET_USER_INFO,userInfo:{
                    id:data.user.id,
                    name:data.user.name,
                    email:data.user.email,
                    profileImage:data.user.profilePicture,
                    status:data.user.about,    
                  }
                })
                alert("Profile Edited")
                router.push("/")
              }
          }
          catch(err){
            console.log(err)
          }
        }
      }

      const handleBack = ()=>{
        router.push('/')
      } 

  return (
    <div className="w-full flex items-center justify-center">
    <div className=" bg-white h-screen w-screen lg:w-[50%] text-white flex flex-col items-center justify-center">
    <div className="flex items-start ml-[-7rem] justify-evenly gap-2 w-full">
        </div>
        <div className="flex items-start justify-start w-full pl-2"><div
          className="flex justify-start items-start text-5xl cursor-pointer"
          onClick={handleBack}
          >
          <IoMdArrowRoundBack className="cursor-pointer text-xl text-black" />
        </div></div>
    <h2 className="text-2xl text-black">Edit Your Profile</h2>
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
          onClick={editUserHandler}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
  );
}

export default profile;
