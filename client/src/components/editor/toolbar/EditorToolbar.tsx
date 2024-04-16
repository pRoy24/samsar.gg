import React, { useState, useEffect } from 'react';
import CommonButton from '../../common/CommonButton.tsx';
import PromptGenerator from './PromptGenerator.tsx';
import AddText from './AddText.tsx';

export default function EditorToolbar(props: any) {
  const {  saveIntermediateImage,
    showAttestationDialog,
    sessionDetails, nftData, setNftData,
    chainList, setSelectedChain, selectedChain,
    showTemplatesSelect, addTextBoxToCanvas
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

  const submitAddText = (evt) => {
    const payload = {
      type: 'text',
      text: addText,
    }
    addTextBoxToCanvas(payload);
  }

  let generateDisplay = <span />;
  if (showGenerateDisplay) {
    generateDisplay = (
      <PromptGenerator {...props} />
    )
  }

  let addTextDisplay = <span />;
  if (showAddTextDisplay) {
    addTextDisplay = (
      <AddText setAddText={setAddText}
        submitAddText={submitAddText}
      />
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

  return (
    <div className='bg-neutral-50 h-full m-auto'>
      <div>

        <div className=' pt-4 pb-4 bg-green-200 mt-4 rounded-sm'>

          <div className='grid grid-cols-2'>
            <CommonButton onClick={saveIntermediateImage}>
              Save
            </CommonButton>
            <div className='flex'>
              <input type='checkbox' checked className='inline-flex' />
              <span className='inline-flex text-xs text-left pl-1 pr-2'>
                Auto Checkpoint
              </span>
            </div>
          </div>
        </div>

        <div className='pt-4 pb-4 bg-green-200 mt-4 rounded-sm' >
          <div className='text-lg font-bold  m-auto cursor-pointer' onClick={showTemplatesSelect}>
            Templates
          </div>
        </div>
        <div className='pt-4 pb-4 bg-green-200 mt-4 rounded-sm'>
          <div className='text-lg font-bold m-auto cursor-pointer' onClick={toggleShowgenerateDisplay}>
            Generate
          </div>
          {generateDisplay}
        </div>

        <div className='pt-4 pb-4 bg-green-200 mt-4 rounded-sm'>
          <div className='text-lg font-bold  m-auto cursor-pointer' onClick={() => setShowAddTextDisplay(!showAddTextDisplay)}>
            Add Text
          </div>
          {addTextDisplay}
        </div>
        <div className='pt-4 pb-4 bg-green-200 mt-4 rounded-sm'>
          <div className='text-lg font-bold m-auto cursor-pointer' onClick={() => setComingSoon()}>
            Upload Image
          </div>
        </div>
        <div className='pt-4 pb-4 bg-green-200 mt-4 rounded-sm'>
          <div className='text-lg font-bold m-auto cursor-pointer' onClick={() => setComingSoon()}>
            Magic Brush
          </div>
        </div>

        <div className='pt-4 pb-4 bg-green-200 mt-4 rounded-sm'>
        
          <div className='text-lg font-bold m-auto cursor-pointer' onClick={showAttestationDialog}>

            Publish
          </div>
        </div>

      </div>

    </div>
  )
}