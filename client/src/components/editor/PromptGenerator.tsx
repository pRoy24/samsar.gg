import React, { useState, useEffect } from "react";
import CommonButton from "../common/CommonButton.tsx";
import axios from "axios";

export default function PromptGenerator(props) {
  const { promptText, setPromptText, submitGenerateRequest } = props;

  return (
    <div>
  
      <textarea onChange={(evt) => setPromptText((evt.target.value))}/>
      <div>
        <CommonButton onClick={submitGenerateRequest}>
          Submit
        </CommonButton>
      </div>

    </div>
  )
}