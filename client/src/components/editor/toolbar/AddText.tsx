import React from 'react';
import CommonButton from "../../common/CommonButton.tsx";

export default function AddText(props) {
  const { setAddText, submitAddText } = props;

  return (
    <div>
      <textarea onChange={(evt) => setAddText((evt.target.value))} />
      <div>
        <CommonButton onClick={submitAddText}>
          Submit
        </CommonButton>
      </div>
    </div>
  )
}