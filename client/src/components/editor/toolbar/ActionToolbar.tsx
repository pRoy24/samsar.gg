import React from "react";
import { FaHand } from "react-icons/fa6";
import { FaDownload, FaExpandArrowsAlt, FaUpload, FaSave } from "react-icons/fa";



export default function ActionToolbar() {
  return (
    <div className="bg-neutral-50 h-full m-auto fixed top-0 overflow-y-auto">
      <div className="h-[60%]">
        <div className="mt-[80px] text-center m-auto align-center ml-4 mb-4">
          <FaHand className="text-2xl font-bold text-neutral-950 hover:text-neutral-600 cursor-pointer" />
        </div>
        <div className="text-center m-auto align-center ml-4 mt-4 mb-4">
          <FaExpandArrowsAlt className="text-2xl" />
        </div>
        <div>

        </div>
      </div>
      <div>
        <div className="text-center m-auto align-center ml-4 mt-4 mb-4">
          <FaSave className="text-2xl" />
        </div>
        <div className="text-center m-auto align-center ml-4 mt-4 mb-8">
          <FaUpload className="text-2xl" />
        </div>
      </div>
    </div>
  )
}