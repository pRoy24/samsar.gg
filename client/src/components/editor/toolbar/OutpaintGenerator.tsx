import React from "react";
import CommonButton from "../../common/CommonButton.tsx";
import { IMAGE_EDIT_MODEL_TYPES } from "../../../constants/Types.ts";


export default function OutpaintGenerator(props) {
  const { promptText, setPromptText, submitOutpaintRequest,
    selectedEditModel, setSelectedEditModel,
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

  let editOptionsDisplay = <span />;


  if (selectedEditModel === "SDXL") {

    editOptionsDisplay = (<div className="grid grid-cols-3 gap-1">
      <div>
        <input type="text" className="w-[96%] pl-2 pr-2" name="guidanceScale" defaultValue={6}/>
        <div className="text-xs ">
            Guidance 
         </div> 
      </div>
      <div>
        <input type="text" className="w-[96%] pl-2 pr-2" name="numInferenceSteps" defaultValue={26}/>
        <div className="text-xs">
          Inference
        </div>  
      </div>
      <div>

        <input type="text" className="w-[96%] pl-2 pr-2" name="strength" defaultValue={0.7} />
        <div className="text-xs">
          Strength
        </div>  
      </div>

    </div>);
  }
  return (
    <div>
      <form onSubmit={submitOutpaintRequest}>
      <div className=" w-full mt-2 mb-2">
        <div className="block">
          <div className="text-xs font-bold">
            Model
          </div>
          <select onChange={setSelectedModelDisplay}  className="inline-flex w-[75%]">
            {modelOptionMap}
          </select>

        </div>


        <div className="block">
          {editOptionsDisplay}
        </div>
      </div>

      <textarea name="promptText" onChange={(evt) => setPromptText((evt.target.value))} className="w-full m-auto p-4 rounded-lg" />
      <div>
        <CommonButton type="submit"  isPending={isOutpaintPending}>
          Submit
        </CommonButton>
      </div>
      </form>
    </div>
  )
}
