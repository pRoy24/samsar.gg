import React, { useState, useEffect } from 'react';
import CommonButton from '../../common/CommonButton.tsx';
import PromptGenerator from './PromptGenerator.tsx';
import OutpaintGenerator from './OutpaintGenerator.tsx';
import RangeSlider from '../utils/RangeSlider.js';
import AddText from './AddText.tsx';
import { FaChevronDown, FaChevronUp, FaRobot, FaExpandArrowsAlt } from 'react-icons/fa';
import { FaCircle, FaHand } from "react-icons/fa6";
import { FaRegCircle } from "react-icons/fa";
import { MdOutlineRectangle } from "react-icons/md";
import { IoTriangleOutline } from "react-icons/io5";




import LayersDisplay from './LayersDisplay.tsx';
import { CURRENT_TOOLBAR_VIEW } from '../../../constants/Types.ts';

export default function EditorToolbar(props: any) {
  const { saveIntermediateImage,
    showAttestationDialog,
    sessionDetails, nftData, setNftData,
    chainList, setSelectedChain, selectedChain,
    showTemplatesSelect, addTextBoxToCanvas,
    showMask, setShowMask,
    editBrushWidth, setEditBrushWidth,
    setCurrentViewDisplay, currentViewDisplay,
    textConfig, setTextConfig,
    activeItemList, setActiveItemList,
    selectedGenerationModel, setSelectedGenerationModel,
    editMasklines, setEditMaskLines,
    setSelectedShape,
    isOutpaintPending,
    
  } = props;


  const [showGenerateDisplay, setShowGenerateDisplay] = useState(false);
  const [showAddTextDisplay, setShowAddTextDisplay] = useState(false);

  const [addText, setAddText] = useState('');


  const toggleShowgenerateDisplay = () => {
    setShowGenerateDisplay(!showGenerateDisplay);
  }

  const setNFTName = (value: string) => {
    let newNftData = Object.assign({}, nftData, { name: value });
    setNftData(newNftData);
  }

  const setNFTDescription = (value: string) => {
    let newNftData = Object.assign({}, nftData, { description: value });
    setNftData(newNftData);
  }
  const handleSelectChange = (event) => {

    console.log("Selected Chain ID:", event.target.value);
  };

  const setAdminAllocation = (value: string) => {
    let newNftData = Object.assign({}, nftData, { adminAllocation: value });
    setNftData(newNftData);
  }

  const submitAddText = () => {
    const payload = {
      type: 'text',
      text: addText,
      config: textConfig
    }
    addTextBoxToCanvas(payload);
  }

  let generateDisplay = <span />;
  if (currentViewDisplay === CURRENT_TOOLBAR_VIEW.SHOW_GENERATE_DISPLAY) {
    generateDisplay = (
      <PromptGenerator {...props} />
    )
  }

  let addTextDisplay = <span />;
  if (currentViewDisplay === CURRENT_TOOLBAR_VIEW.SHOW_ADD_TEXT_DISPLAY) {
    addTextDisplay = (
      <AddText setAddText={setAddText}
        submitAddText={submitAddText}
        textConfig={textConfig} setTextConfig={setTextConfig}

      />
    )
  }

  let editDisplay = <span />;
  if (currentViewDisplay === CURRENT_TOOLBAR_VIEW.SHOW_EDIT_MASK_DISPLAY) {
    editDisplay = (
      <div>
        <RangeSlider editBrushWidth={editBrushWidth} setEditBrushWidth={setEditBrushWidth} />
        <OutpaintGenerator {...props} />
      </div>
    )
  }

  let layersDisplay = <span />;
  if (currentViewDisplay === CURRENT_TOOLBAR_VIEW.SHOW_LAYERS_DISPLAY) {
    layersDisplay = (
      <div>
        <LayersDisplay activeItemList={activeItemList}
          setActiveItemList={setActiveItemList} />
      </div>
    )
  }

  let nftDataForm = <span />;
  if (sessionDetails && sessionDetails.attestationId) {
    let chainSelect = (
      <select onChange={handleSelectChange} >
        {chainList.map((chain) => {
          let isSelected = '';
          if (chain.id == selectedChain) {
            isSelected = 'selected';
          }
          return (
            <option key={chain.id} value={chain.id} selected={isSelected}>{chain.name}</option>
          )
        })}
      </select>
    )
    let adminAllocationSelect = (
      <input type='text' placeholder='Admin Allocation' className='mb-2'
        value={nftData.adminAllocation} defaultValue={300} onChange={(evt) => { setAdminAllocation(evt.target.value) }}
      />
    )
    nftDataForm = (
      <div>
        <input type='text' placeholder='NFT Name' className='mb-2' value={nftData.name}
          onChange={(evt) => (setNFTName(evt.target.value))} />
        <input type='text' placeholder='NFT Description' className='mb-2' value={nftData.description}
          onChange={(evt) => (setNFTDescription(evt.target.value))} />
        <div>
          <div>
            {chainSelect}
          </div>
          <div>
            {adminAllocationSelect}
          </div>
        </div>
      </div>
    )
  }

  const setComingSoon = () => {

  }

  let addShapeDisplay = (
    
      <div className='grid grid-cols-3'>
        <div className='text-center pl-2 pr-2'>
          <div className='text-sm font-bold m-auto cursor-pointer' onClick={() => setSelectedShape("circle")}>
            <FaRegCircle className='m-auto'/>
            <div className='text-[10px] font-bold'>
              Circle
            </div>
          </div>
        </div>
        <div className='text-center pl-2 pr-2'>
          <div className='text-sm font-bold m-auto cursor-pointer' onClick={() => setSelectedShape("rectangle")}>
            <MdOutlineRectangle className='m-auto'/>
            <div className='text-[10px] font-bold'>
              Rectangle
            </div>  
          </div>
        </div>
        <div className='text-center pl-2 pr-2'>
          <div className='text-sm font-bold m-auto cursor-pointer' onClick={() => setSelectedShape("triangle")}>
            <IoTriangleOutline className='m-auto'/>
            <div className='text-[10px] font-bold'>
              Polygon
            </div>

          </div>
        </div>
      </div>
    )
  

  return (
    <div className='bg-neutral-50 h-full m-auto fixed top-0 overflow-y-auto ml-4 mr-4 w-[16%]'>

      <div>


      </div>
      <div className='mt-[80px] '>

        <div className='pt-4 pb-4 bg-stone-200 mt-4 rounded-sm  text-left pl-2 pr-2'>
          <div className='text-lg font-bold m-auto cursor-pointer' onClick={() => setCurrentViewDisplay(CURRENT_TOOLBAR_VIEW.SHOW_GENERATE_DISPLAY)}>
            <div className='inline-flex ml-4 pl-4'>
              Generate
            </div>
            <FaRobot className='inline-flex text-lg ml-1 mb-1 text-neutral-500' />

            <FaChevronDown className='inline-flex float-right mr-4 mt-2 text-sm' />
          </div>
          {generateDisplay}
        </div>
        <div className='pt-4 pb-4 bg-stone-200 mt-4 rounded-sm  text-left pl-2 pr-2'>
          <div className='text-lg font-bold m-auto cursor-pointer' onClick={() => setCurrentViewDisplay(CURRENT_TOOLBAR_VIEW.SHOW_EDIT_MASK_DISPLAY)}>
            <div className='inline-flex ml-4 pl-4'>
              Edit
            </div>
            <FaRobot className='inline-flex text-sm ml-1' />
            <FaChevronDown className='inline-flex float-right mr-4 mt-2 text-sm' />
          </div>
          {editDisplay}
        </div>

        <div className='pt-4 pb-4 bg-stone-200 mt-4 rounded-sm text-left pl-2 pr-2'>
          <div className='text-lg font-bold  m-auto cursor-pointer' onClick={() => setCurrentViewDisplay(CURRENT_TOOLBAR_VIEW.SHOW_ADD_TEXT_DISPLAY)}>
            <div className='inline-flex ml-4 pl-4'>
              Add Text
            </div>
            <FaChevronDown className='inline-flex float-right mr-4 mt-2 text-sm' />
          </div>
          {addTextDisplay}
        </div>
        <div className='pt-4 pb-4 bg-stone-200 mt-4 rounded-sm text-left pl-2 pr-2'>
          <div className='text-lg font-bold  m-auto cursor-pointer' onClick={() => setCurrentViewDisplay(CURRENT_TOOLBAR_VIEW.SHOW_ADD_TEXT_DISPLAY)}>
            <div className='inline-flex ml-4 pl-4'>
              Add Shape
            </div>
            <FaChevronDown className='inline-flex float-right mr-4 mt-2 text-sm' />
          </div>
          
          {addShapeDisplay}

        </div>

        <div className='pt-4 pb-4 bg-stone-200 mt-4 rounded-sm text-left pl-2 pr-2'>
          <div className='text-lg font-bold m-auto cursor-pointer' onClick={() => setCurrentViewDisplay(CURRENT_TOOLBAR_VIEW.SHOW_LAYERS_DISPLAY)}>
            <div className='inline-flex ml-4 pl-4'>
              Layers
            </div>
            <FaChevronDown className='inline-flex float-right mr-4 mt-2 text-sm' />
          </div>
          {layersDisplay}
        </div>
        <div className='pt-4 pb-4 bg-stone-200 mt-4 rounded-sm text-left pl-2 pr-2'>

          <div className='text-lg font-bold m-auto cursor-pointer' onClick={showAttestationDialog}>
            <div className='inline-flex ml-4 pl-4'>
              Publish
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}