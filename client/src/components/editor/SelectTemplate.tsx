import React, { useEffect } from 'react';

const IPFS_URL_BASE = process.env.REACT_APP_IPFS_URL_BASE;

export default function SelectTemplate(props) {
  const { getRemoteTemplateData , templateOptionList, addImageToCanvas} = props;
  
  useEffect(() => {
    getRemoteTemplateData();
  }, []);


  return (
    <div className='grid grid-cols-4 grid-cols-gap-1'>
      
      {templateOptionList.map((templateOption, index) => {
        return (
          <div className='h-64 cursor-pointer mb-4 rounded-lg mt-4' onClick={() => addImageToCanvas(templateOption)}>
            <img src={`${IPFS_URL_BASE}/ipfs/${templateOption.ipfs_pin_hash}`} />
          </div>
        )
      })}
    </div>
  )
}