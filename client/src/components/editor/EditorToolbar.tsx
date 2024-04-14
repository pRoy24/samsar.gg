import React, { useState, useEffect } from 'react';
import CommonButton from '../common/CommonButton.tsx';
import PromptGenerator from './PromptGenerator.tsx';

export default function EditorToolbar(props: any) {
  const { promptText, publishCanvas , showTemplates, saveIntermediateImage, 
    showAttestationDialog,
    sessionDetails, nftData, setNftData,
    chainList, setSelectedChain, selectedChain,
  } = props;


  const [showGenerateDisplay, setShowGenerateDisplay] = useState(false);



  const toggleShowgenerateDisplay = () => {

    setShowGenerateDisplay(!showGenerateDisplay);
  }

  const setNFTName = (value: string) => {
    let newNftData = Object.assign({}, nftData, {name: value});
    setNftData(newNftData);
  }

  const setNFTDescription = (value: string) => {
    let newNftData = Object.assign({}, nftData, {description: value});
    setNftData(newNftData);
  }
  const handleSelectChange = (event) => {
    setSelectedChain(event.target.value);
    console.log("Selected Chain ID:", event.target.value);
  };

  const setAdminAllocation = (value: string) => {
    let newNftData = Object.assign({}, nftData, {adminAllocation: value});
    setNftData(newNftData);
  }

  let generateDisplay = <span />;
  if (showGenerateDisplay) {
    generateDisplay = (
      <PromptGenerator {...props}/>
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
       value={nftData.adminAllocation} defaultValue={300} onChange={(evt) => {setAdminAllocation(evt.target.value)}}
      />
    )
    nftDataForm = (
      <div>
        <input type='text' placeholder='NFT Name' className='mb-2' value={nftData.name}
        onChange={(evt) => (setNFTName(evt.target.value))}/>
        <input type='text' placeholder='NFT Description' className='mb-2' value={nftData.description}
        onChange={(evt) => (setNFTDescription(evt.target.value))}/>
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

  return (
    <div className='bg-green-500 h-full m-auto'>
      <div>
        <div>
          <div className='inline-flex'>
          <CommonButton onClick={saveIntermediateImage}>
            Save
          </CommonButton>
          </div>
  

        </div>
        <div>
          <CommonButton onClick={toggleShowgenerateDisplay}>
            Generate
          </CommonButton>
          {generateDisplay}
        </div>
        <div>
          <div onClick={showTemplates}>
            Templates
          </div>
        </div>
        <div>
          <CommonButton>
            Select & Resize
          </CommonButton>
        </div>

        <div>
          <CommonButton>
            Select & Edit
          </CommonButton>
        </div>
        <div>
          <CommonButton>
            Add Text
          </CommonButton>
        </div>
        <div>
          <CommonButton>
            Upload Image
          </CommonButton>
        </div>
        <div>
          {nftDataForm}
          <div onClick={showAttestationDialog}>

            Publish
          </div>
        </div>

      </div>

    </div>
  )
}