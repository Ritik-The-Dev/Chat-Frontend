import React from "react";
import { BsCheck ,BsCheckAll} from "react-icons/bs";

function MessageStatus({messageStatus}) {
  return <>
  {messageStatus === "sent" && <BsCheck className=" text-lg mt-[5px] "/>}
  {messageStatus === "delivered" && <BsCheckAll className=" text-lg mt-[5px] "/>}
  {messageStatus === "read" && <BsCheckAll className=" text-lg mt-[5px] text-icon-ack"/>}
  </>
}

export default MessageStatus;
