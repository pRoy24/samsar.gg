import React, { useState, useEffect } from 'react';
import CommonButton from "../../common/CommonButton.tsx";
import { useColorMode } from '../../../contexts/ColorMode.js';

export default function AddText(props) {
  const { setAddText, submitAddText,
    textConfig, setTextConfig
  } = props;

  const { fontSize, fontFamily, fillColor } = textConfig;
  const setFontSize = (value) => {
    setTextConfig({ ...textConfig, fontSize: value });
  }
  const setFontFamily = (value) => {
    setTextConfig({ ...textConfig, fontFamily: value });
  }
  const setFillColor = (value) => {
    setTextConfig({ ...textConfig, fillColor: value });
  }

  const { colorMode } = useColorMode();
  const formElementBG = colorMode === "dark" ? "bg-gray-800 text-neutral-50" : "bg-gray-100 text-neutral-800";
  const textElementBG = colorMode === "dark" ? "bg-gray-800 text-neutral-50" : "bg-gray-100 text-neutral-800 border-gray-600 border-2";

  return (
    <div>
      <div className='grid grid-cols-3'>

        <div>
          <div className='text-xs'>Font Size</div>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className={`${formElementBG} w-full p-2 rounded`}
          >
            {/* Example font sizes */}
            <option value="12">12</option>
            <option value="16">16</option>
            <option value="20">20</option>
            <option value="24">24</option>
            <option value="28">28</option>
            <option value="32">32</option>
            <option value="36">36</option>
            <option value="40">40</option>
            <option value="44">44</option>
            <option value="48">48</option>
            <option value="52">52</option>
            <option value="56">56</option>
            <option value="60">60</option>

          </select>
        </div>
        <div>
          <div className='text-xs'>Font Family</div>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className={`${formElementBG} w-full p-2 rounded`}
          >
            {/* Example font families */}
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>
        <div>
          <div className='text-xs'>Fill Color</div>
          <input
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
            className={`${formElementBG} w-full h-10 border-none`}
          />
        </div>


      </div>
      <textarea onChange={(evt) => setAddText((evt.target.value))} className={`${textElementBG} w-full m-auto p-4 rounded-lg`} />
      <div className='text-center'>
        <CommonButton onClick={submitAddText}>
          Submit
        </CommonButton>
      </div>
    </div>
  )
}