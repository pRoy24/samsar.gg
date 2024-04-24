import React from "react";
import { FaHand } from "react-icons/fa6";
import { FaDownload, FaExpandArrowsAlt, FaUpload, FaSave } from "react-icons/fa";
import { CANVAS_ACTION , CURRENT_TOOLBAR_VIEW} from "../../../constants/Types.ts";
import { HiTemplate } from "react-icons/hi";



export default function ActionToolbar(props) {
  const { setCurrentAction, setCurrentViewDisplay } = props;
  return (
    <div className="bg-neutral-50 h-full m-auto fixed top-0 overflow-y-auto">
      <div className="h-[60%]">



        <div className="mt-[80px] text-center m-auto align-center ml-4 mb-4">
          <FaHand className="text-2xl" />
        </div>
        <div className="text-center m-auto align-center ml-4 mt-8">
          <FaExpandArrowsAlt className="text-2xl" />
        </div>


        <div className=" mt-[80px]">

          <div className="text-center m-auto align-center ml-4 mt-4 mb-4">
            <HiTemplate className="text-2xl" onClick={() => setCurrentViewDisplay(CURRENT_TOOLBAR_VIEW.SHOW_TEMPLATES_DISPLAY)}/>

          </div>
        </div>


      </div>

      <div>
        <div className="text-center m-auto align-center ml-4 mt-4 mb-4">
          <FaSave className="text-2xl" />
        </div>
        <div className="text-center m-auto align-center ml-4 mt-8 mb-8">
          <FaUpload className="text-2xl" />
        </div>
      </div>
    </div>
  )
}