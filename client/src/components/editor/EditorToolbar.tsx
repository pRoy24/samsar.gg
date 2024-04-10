import React, { useState, useEffect } from 'react';
import CommonButton from '../common/CommonButton.tsx';
import PromptGenerator from './PromptGenerator.tsx';

export default function EditorToolbar(props: any) {
  const { promptText, publishCanvas , showTemplates} = props;

  const [showGenerateDisplay, setShowGenerateDisplay] = useState(false);

  const toggleShowgenerateDisplay = () => {

    setShowGenerateDisplay(!showGenerateDisplay);
  }

  let generateDisplay = <span />;
  if (showGenerateDisplay) {
    console.log('showGenerateDisplay')
    generateDisplay = (
      <PromptGenerator {...props}/>
    )
  }

  return (
    <div className='bg-green-500 h-full m-auto'>
      <div>
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
          <div onClick={publishCanvas}>
            Publish
          </div>
        </div>

      </div>

    </div>
  )
}