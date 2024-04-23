import React from "react";
import { FaHand } from "react-icons/fa6";
import { FaDownload, FaExpandArrowsAlt, FaUpload, FaSave } from "react-icons/fa";
import { CANVAS_ACTION } from "../../../constants/Types.ts";


export default function ActionToolbar(props) {
  const { setCurrentAction } = props;
  return (
    <div className="bg-neutral-50 h-full m-auto fixed top-0 overflow-y-auto">
      <div className="h-[60%]">

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