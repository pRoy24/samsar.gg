import React from "react";

export default function FrameActionButton(props) {
  const { children, onClick } = props;
  return (
    <button className="bg-slate-300 boder-2 border-slate-900 text-slate-800 rounded-md p-2" onClick={onClick}>
      {children}
     </button> 
  )

}