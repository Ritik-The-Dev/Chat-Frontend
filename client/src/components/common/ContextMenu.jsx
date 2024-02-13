import React, { useEffect, useRef } from "react";

function ContextMenu({options,coordinates,contextMenu,setContextMenu}) {
  const ContextMenuRef = useRef(null)

  useEffect(()=>{
    const handleClickOutside = (event) =>{
      if(event.target.id !== "context-opener"){
        if(ContextMenuRef.current && !ContextMenuRef.current.contains(event.target)){
          setContextMenu(false)
        }
      }
    }
    document.addEventListener("click",handleClickOutside);
    return()=>{
      document.removeEventListener("click",handleClickOutside)
    }
  },[])
  const handleClick = (e,callback)=>{
    e.stopPropagation();
    setContextMenu(false)
    callback();
  }
  
  return <div className={`shadow-xl bg-white fixed p-y z-[100]`}
  ref={ContextMenuRef}
  style={{
    top:coordinates.y,
    left:coordinates.x 
  }}>
    <ul>
      {
        options.map(({name,callback})=>(
          <li key={name} onClick={(e)=>handleClick(e,callback)}
          className="px-5 py-2 cursor-pointer hover:bg-gray-100"
          >
            <span className="text-black">
            {name}</span></li>
        ))
      }
    </ul>
  </div>
}

export default ContextMenu;
