import React from "react";
import { FaHand } from "react-icons/fa6";
import { FaDownload, FaExpandArrowsAlt, FaUpload, FaSave } from "react-icons/fa";
import { CANVAS_ACTION , CURRENT_TOOLBAR_VIEW} from "../../../constants/Types.ts";
import { HiTemplate } from "react-icons/hi";



export default function ActionToolbar(props) {
  const { setCurrentAction, setCurrentViewDisplay , showMoveAction, showResizeAction , 
    showSaveAction,
    showUploadAction,

  } = props;
  return (
    <div className="bg-neutral-50 h-full m-auto fixed top-0 overflow-y-auto">
      <div className="h-[60%]">

        <div className=" mt-[80px]">

          <div className="text-center m-auto align-center  mt-4 mb-4">
            <HiTemplate className="text-2xl ml-4 cursor-pointer" onClick={() => setCurrentViewDisplay(CURRENT_TOOLBAR_VIEW.SHOW_TEMPLATES_DISPLAY)} />
            <div className="text-[12px] tracking-tight m-auto text-center">
              Templates
            </div>  
          </div>
        </div>
      </div>
      <div>
        <div className="text-center m-auto align-center mt-4 mb-4">
          <FaSave className="text-2xl ml-4 cursor-pointer" onClick={() => showSaveAction()}/>
          <div className="text-[12px] tracking-tight m-auto text-center">
              Save
            </div>  
        </div>
        <div className="text-center m-auto align-center mt-8 mb-8">
          <FaUpload className="text-2xl ml-4 cursor-pointer" onClick={() => showUploadAction()}/>
          <div className="text-[12px] tracking-tight m-auto text-center">
              Upload
            </div>  
        </div>
      </div>
    </div>
  )
}