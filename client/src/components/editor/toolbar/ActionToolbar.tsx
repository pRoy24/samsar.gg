import React from "react";
import { FaHand } from "react-icons/fa6";
import { FaDownload, FaExpandArrowsAlt, FaUpload, FaSave } from "react-icons/fa";
import { CANVAS_ACTION, CURRENT_TOOLBAR_VIEW } from "../../../constants/Types.ts";
import { HiTemplate } from "react-icons/hi";
import { useColorMode } from "../../../contexts/ColorMode.js";


export default function ActionToolbar(props) {
  const { setCurrentAction, setCurrentViewDisplay, showMoveAction, showResizeAction,
    showSaveAction,
    showUploadAction,


  } = props;

  let bgColor = "bg-cyber-black border-blue-900 text-white ";
  const { colorMode } = useColorMode();
  if (colorMode === 'light') {
    bgColor = "bg-neutral-50  text-neutral-900 ";
  }
  return (
    <div className={`border-r-2 ${bgColor} shadow-lg h-full m-auto fixed top-0 overflow-y-auto w-[5%]`}>
      <div className="h-[60%]">

        <div className=" mt-[80px]">

          <div className="text-center m-auto align-center  mt-4 mb-4">
            <HiTemplate className="text-2xl m-auto cursor-pointer" onClick={() => setCurrentViewDisplay(CURRENT_TOOLBAR_VIEW.SHOW_TEMPLATES_DISPLAY)} />
            <div className="text-[10px] tracking-tight m-auto text-center">
              Templates
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-center m-auto align-center mt-4 mb-4">
          <FaUpload className="text-2xl m-auto cursor-pointer" onClick={() => showUploadAction()} />
          <div className="text-[12px] tracking-tight m-auto text-center">
            Upload
          </div>
        </div>

      </div>
      <div>
        <div className="text-center m-auto align-center mt-4 mb-4">
          <FaSave className="text-2xl m-auto cursor-pointer" onClick={() => showSaveAction()} />
          <div className="text-[12px] tracking-tight m-auto text-center">
            Save
          </div>
        </div>

      </div>
    </div>
  )
}