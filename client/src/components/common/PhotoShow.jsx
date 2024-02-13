import React, { useState } from "react";
import ReactDOM from 'react-dom'
import { IoClose } from "react-icons/io5";
import axios from 'axios'
import { ADD_PROFILE_POST, DELETE_USER_POST, GET_PROFILE_DETAILS } from "@/utils/ApiRoutes";
import { MdDelete } from "react-icons/md";
import { BsCheck ,BsCheckAll} from "react-icons/bs";

// Component to show a larger photo
export const PhotoShow = ({ deletingIndex = undefined, userInfo = undefined, currentProfileUser = undefined, showPhotoBigger, setshowPhotoBigger, postPhoto ,ImgData}) => {

  const [clicked,setClicked] = useState(false)

  const updateProfile = async ()=>{
    try {
      const { data } = await axios.get(
        `${GET_PROFILE_DETAILS}/${userInfo?._id}`
      );
      if (data.status) {
        dispatch({type:reducerCases.CHANGE_CURRENT_PROFILE_USER,user:{...data.data}})
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Function to handle posting a photo
const handlePostPhoto = async () => {
  try {
    setClicked(true)
    const userId = userInfo?._id;
    const formData = new FormData();
    formData.append('image', ImgData); // Append the file to FormData
    const { data } = await axios.put(`${ADD_PROFILE_POST}/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set correct content type
      },
    });
    updateProfile();
    if (data.status) {
      alert("Photo Uploaded");
      setshowPhotoBigger(undefined);
      setClicked(false)
    }
  } catch (err) {
    console.log("error", err);
    setClicked(false)
  }
};
  
  // Function to handle deleting a post
  const DeletePost = async () => {
    try {
      if(deletingIndex >= 0){
        const userId = userInfo;
        const { data } = await axios.put(DELETE_USER_POST, {
          userId,
          photoIndex: deletingIndex,
        });
        if (data.status) {
          updateProfile();
          alert("Post Deleted");
          setshowPhotoBigger(undefined);
        }
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className={`lg:w-[30%] md:w-[30%] h-auto sm:w-full relative z-10 p-4 bg-white rounded-lg shadow-lg`}>
          {/* Delete button visible only for the owner of the photo */}
          {deletingIndex >= 0 && userInfo === currentProfileUser?._id && userInfo !== undefined && currentProfileUser?._id ? (
            <MdDelete className="text-3xl cursor-pointer" onClick={() => { DeletePost() }} />
          ) : null}
          {/* Close button */}
          <button
            onClick={() => setshowPhotoBigger(undefined)}
            className="absolute top-0 right-0 m-2 text-white rounded-full bg-gray-800 p-2 hover:bg-gray-700"
          >
            <IoClose className="text-3xl" />
          </button>
          {/* Display the larger photo */}
          <img src={showPhotoBigger} alt="Photo" className=" rounded-lg" />
          {/* Button to post the photo */}
          {postPhoto && <div onClick={clicked ? null : handlePostPhoto}>
            <button className={`flex items-center justify-center mt-5 text-white ${clicked ? "bg-gray-200" :"bg-blue-500"} p-1 px-3 font-bold text-lg rounded-full w-[10rem] h-14 `}>
              Post Now
            </button>
          </div>}
        </div>
      </div>
    </>
  );
}

// Component for file input to pick a photo
export const PhotoPicker = ({ onChange }) => {
  // Create a portal for the file input
  const component = <input type="file" hidden id="photo-picker" onChange={onChange} />
  return ReactDOM.createPortal(component,
    document.getElementById('photo-picker-element'))
}

// Component to show message status (sent, delivered, read)
export const MessageStatus = ({ messageStatus }) => {
  return <>
    {messageStatus === "sent" && <BsCheck className=" text-lg mt-[5px] " />}
    {messageStatus === "delivered" && <BsCheckAll className=" text-lg mt-[5px] " />}
    {messageStatus === "read" && <BsCheckAll className=" text-lg mt-[5px] text-icon-ack" />}
  </>
}

export const ShowHighlight = ({ deletingIndex = undefined, userInfo = undefined, currentProfileUser = undefined, showHighlight, setshowHighlight})=>{
  return <>
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="fixed inset-0 bg-black opacity-50"></div>
    <div className={`lg:w-[30%] md:w-[30%] h-auto sm:w-full relative z-10 p-4 bg-white rounded-lg shadow-lg`}>
      {/* Delete button visible only for the owner of the photo */}
      {deletingIndex >= 0 && userInfo === currentProfileUser?._id && userInfo !== undefined && currentProfileUser?._id ? (
        <MdDelete className="text-3xl cursor-pointer" onClick={() => { DeletePost() }} />
      ) : null}
      {/* Close button */}
      <button
        onClick={() => setshowHighlight(undefined)}
        className="absolute top-0 right-0 m-2 text-white rounded-full bg-gray-800 p-2 hover:bg-gray-700"
      >
        <IoClose className="text-3xl" />
      </button>
      {/* Display the larger photo */}
      <img src={showHighlight} alt="Photo" className=" rounded-lg" />
      {/* Button to post the photo */}
      {/* {postPhoto && <div onClick={clicked ? null : handlePostPhoto}>
        <button className={`flex items-center justify-center mt-5 text-white ${clicked ? "bg-gray-200" :"bg-blue-500"} p-1 px-3 font-bold text-lg rounded-full w-[10rem] h-14 `}>
          Post Now
        </button>
      </div>} */}
    </div>
  </div>
</>
}