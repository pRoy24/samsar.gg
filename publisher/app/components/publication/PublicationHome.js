import React from 'react';
import CommonContainer from '../common/CommonContainer.js';
const IPFS_BASE = 'https://cloudflare-ipfs.com/ipfs/';

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3005';

export default function PublicationHome(props) {
  const { meta } = props;
  const getTransactionFrame = () => {
    console.log("Getting transaction frame");
    const URL = `${HOST_URL}/api/frame/get-mint-tx`;
    console.log(URL);
    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        interactor: '0x1234567890123456789012345678901234567890'
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }
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
            <div onClick={() => getTransactionFrame()}>
              Mint
            </div>
            <div>
              Burn
            </div>
            <div>
              Info
            </div>
            <div>
              Like
            </div>
          </div>
        </div>
      </div>
    </CommonContainer>

  )

}