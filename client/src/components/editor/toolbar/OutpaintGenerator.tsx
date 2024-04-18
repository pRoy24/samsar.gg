import React from "react";
import CommonButton from "../../common/CommonButton.tsx";

export default function OutpaintGenerator(props) {
  const { promptText, setPromptText, submitOutpaintRequest } = props;

  return (
    <div>
  
      <textarea onChange={(evt) => setPromptText((evt.target.value))} className="w-full m-auto p-4 rounded-lg" />
      <div>
        <CommonButton onClick={submitOutpaintRequest}>
          Submit
        </CommonButton>
      </div>

    </div>
  )
}
