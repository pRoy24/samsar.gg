import React from 'react';
import CommonContainer from '../common/CommonContainer.js';

export default function PublicationHome(props) {
  const { meta } = props;
  return (
    <CommonContainer>
      <div className="m-auto">


        <div className="text-center">
          <h1>Page Page</h1>
        </div>

        <div className="w-[512px] m-auto">
          <h2>{meta.title}</h2>
          <img src={`${IPFS_BASE}${meta.imageHash}`} className="m-auto" style={{ width: '512px' }} />

          <p>{meta.description}</p>
          <div className="grid grid-cols-4">
            <div>
              Mint
            </div>
            <div>
              Tip
            </div>
            <div>
              Like
            </div>
            <div>
              Info
            </div>
          </div>
        </div>
      </div>
    </CommonContainer>

  )

}