import React, { useState } from 'react';
import { FaRegCircle } from "react-icons/fa";
import { MdOutlineRectangle } from "react-icons/md";
import { IoTriangleOutline } from "react-icons/io5";
import CustomNumberInput from './CustomNumberInput.tsx';


export default function AddShapeDisplay(props: any) {
  const { setSelectedShape, setStrokeColor, setFillColor , fillColor, strokeColor,
    strokeWidthValue, setStrokeWidthValue
   } = props;



  return (
    <div className='p-4'>
      <div className='grid grid-cols-3 gap-4'>
        {/** Shape selectors */}
        <div className='text-center'>
          <div className='text-sm font-bold cursor-pointer' onClick={() => setSelectedShape("circle")}>
            <FaRegCircle className='mx-auto text-2xl icon-white' />
            <div className='text-xs font-bold mt-2'>
              Circle
            </div>
          </div>
        </div>
        <div className='text-center'>
          <div className='text-sm font-bold cursor-pointer' onClick={() => setSelectedShape("rectangle")}>
            <MdOutlineRectangle className='mx-auto text-2xl icon-white' />
            <div className='text-xs font-bold mt-2'>
              Rectangle
            </div>
          </div>
        </div>
        <div className='text-center'>
          <div className='text-sm font-bold cursor-pointer' onClick={() => setSelectedShape("triangle")}>
            <IoTriangleOutline className='mx-auto text-2xl icon-white' />
            <div className='text-xs font-bold mt-2'>
              Triangle
            </div>
          </div>
        </div>
      </div>

      {/** Color display and pickers */}
      <div className='grid grid-cols-2 gap-2 mt-8  align-top'>
      <div className='relative w-full'>
          <div className='flex items-center justify-center align-top'>
            <div>
            <input type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} />
              <div className='block text-sm font-bold'>
                Fill
              </div>
            </div>
          </div>
        </div>
        <div className='relative w-full'>
          <div className='flex items-center justify-center align-top'>
            <div>
            <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} />
              <div className='block text-sm font-bold'>
                Stroke
              </div>
            </div>
          </div>
          <div>
            <CustomNumberInput 
            value={strokeWidthValue}
            setValue={setStrokeWidthValue}
            />
            <div className='block text-xs font-bold text-center'>
              Stroke Width
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
