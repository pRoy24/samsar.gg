import React, { useState, useEffect } from "react";
import CommonButton from "../../common/CommonButton.tsx";


export default function PromptGenerator(props) {
  const { promptText, setPromptText, submitGenerateRequest } = props;

  return (
    <div>
      <textarea onChange={(evt) => setPromptText((evt.target.value))} className="w-full m-auto p-4 rounded-lg" />
      <div>
        <CommonButton onClick={submitGenerateRequest}>
          Submit
        </CommonButton>
      </div>

    </div>
  )
}