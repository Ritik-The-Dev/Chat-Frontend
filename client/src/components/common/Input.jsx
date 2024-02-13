import React from "react";

function Input({name,state,setState,label=false}) {
  return <div className="flex flex-col gap-1">
    {
      label && (
        <label htmlFor={name} className=" text-black text-lg px-1">
          {name}
        </label>
      )
    }
    <div>
      <input type="text" name="name" value={state} onChange={(e)=> setState(e.target.value)}
      className=" bg-gray-100 text-start focus:outline-none text-black h-10 rounded-lg px-5 py-4 w-full" />
    </div>
  </div>
}

export default Input;
