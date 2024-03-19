import React from "react";
import ReactDOM from 'react-dom'
import { IoClose } from "react-icons/io5";
import { BsCheck ,BsCheckAll} from "react-icons/bs";

// Component to show a larger photo
export const PhotoShow = ({showPhotoBigger, setshowPhotoBigger}) => {

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className={`lg:w-[30%] md:w-[30%] h-auto sm:w-full relative z-10 p-4 bg-white rounded-lg shadow-lg`}>
          {/* Close button */}
          <button
            onClick={() => setshowPhotoBigger(undefined)}
            className="absolute top-0 right-0 m-2 text-white rounded-full bg-gray-800 p-2 hover:bg-gray-700"
          >
            <IoClose className="text-3xl" />
          </button>
          {/* Display the larger photo */}
          <img src={showPhotoBigger} alt="Photo" className=" rounded-lg" />   
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
