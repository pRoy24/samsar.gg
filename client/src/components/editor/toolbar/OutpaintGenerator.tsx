import React from "react";
import CommonButton from "../../common/CommonButton.tsx";
import { IMAGE_EDIT_MODEL_TYPES } from "../../../constants/Types.ts";


export default function OutpaintGenerator(props) {
  const { promptText, setPromptText, submitOutpaintRequest,
    selectedEditModel, setSelectedEditModel ,
    isOutpaintPending
   } = props;


  const modelOptionMap = IMAGE_EDIT_MODEL_TYPES.map((model) => {
    return (
      <option key={model.key} value={model.key} selected={model.key === selectedEditModel}>
        {model.name}
      </option>
    )
  })

  const setSelectedModelDisplay = (evt) => {
    setSelectedEditModel(evt.target.value);
  }

  return (
    <div>
        <div className="flex w-full mt-2 mb-2">
        <div className="inline-flex w-[25%]">
          <div className="text-xs font-bold">
            Model
          </div>
        </div>
        <select onChange={setSelectedModelDisplay} className="inline-flex w-[75%]">
          {modelOptionMap}
        </select>
      </div>

      <textarea onChange={(evt) => setPromptText((evt.target.value))} className="w-full m-auto p-4 rounded-lg" />
      <div>
        <CommonButton onClick={submitOutpaintRequest} isPending={isOutpaintPending}>
          Submit
        </CommonButton>
      </div>

    </div>
  )
}
