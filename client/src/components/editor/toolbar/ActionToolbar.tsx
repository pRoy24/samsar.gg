import React from "react";
import { FaHand } from "react-icons/fa6";
import { FaExpandArrowsAlt, FaUpload } from "react-icons/fa";



export default function ActionToolbar() {
  return (
    <div className="bg-neutral-50 h-full m-auto fixed top-0 overflow-y-auto">
      <div className="h-[80%]">
        <div className="mt-[80px] text-center m-auto align-center ml-4">
          <FaHand  className="text-lg font-bold text-neutral-950 hover:text-neutral-600 cursor-pointer"/>
        </div>
        <div className="text-center m-auto align-center ml-4 mt-4">
          <FaExpandArrowsAlt />
        </div>
        <div>
          
        </div>
      </div>
      <div>
        <div>
          <div className="text-center m-auto align-center ml-4 mt-4">
            <FaUpload />
          </div>
        </div>  
      </div>
    </div>
  )
}