import React, { useEffect, useState } from 'react';
import CommonContainer from '../common/CommonContainer.js';
import { useRouter } from 'next/router';
import FrameActionButton from '../common/FrameActionButton.js';
import { prepareMintTransaction , burnTransaction , getContractObject} from '../../../utils/ContractOperations.js';

import { sendTransaction , readContract, prepareContractCall, toWei} from 'thirdweb';
import { useActiveAccount, useSendTransaction,  useReadContract, TransactionButton} from "thirdweb/react";

const IPFS_BASE = 'https://cloudflare-ipfs.com/ipfs/';

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3005';

export default function PublicationHome(props) {
  const { meta } = props;
  const [ onChainMeta, setOnChainMeta ] = useState(null);
  const [ currentChain, setCurrentChain ] = useState(null);
  const [ tokenId, setTokenId ] = useState(null);

  const router = useRouter();


  const activeAccount = useActiveAccount();



  const contract = getContractObject();

    

  const mintNFTTransaction = async () => {








  }



  useEffect(() => {
    if (meta.generationHash) {
      console.log("Generation hash found");
      console.log(meta.generationHash);
      const metaFileURL = `${IPFS_BASE}${meta.metadataHash}`;
      console.log(metaFileURL);
      fetch(metaFileURL)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setOnChainMeta(data);
        });
    }

    const page = router.query.id;
    const pageTokens = page.split('_');
    if (pageTokens.length > 1) {
      setCurrentChain(pageTokens[0])
      setTokenId(pageTokens[1]);
    }
    console.log(page);

  }, []);
  let descriptionBlock = <span />;
  if (onChainMeta) {
    descriptionBlock = (
      <div className="">
        <div className='font-bold'>Name: {onChainMeta.name}</div>
        <p>Description: {onChainMeta.description}</p>
      </div>
    )
  }
  return (
    
    <CommonContainer>
        <div className="w-[640px] m-auto p-4 bg-slate-50 mt-2 rounded-lg border-2 border-color-neutral-400 shadow-lg">
          <div>
            {descriptionBlock}
          </div>
          <img src={`${IPFS_BASE}${meta.imageHash}`} className="m-auto w-[640px]"  />

          <p>{meta.description}</p>
          <div className="grid grid-cols-4 gap-1">

          <TransactionButton
			transaction={() => {
				// Create a transaction object and return it
				const tx = prepareContractCall({
					contract,
					method: "mint",
					params: [tokenId],
          value: toWei("0.0001"),
				})
				return tx;
			}}

      onError={(error) => {
        console.log("Error");
        console.log(error);
      }}
		>
			Mint
		</TransactionButton>

            <FrameActionButton>
              Burn
            </FrameActionButton>
            <FrameActionButton>
              Info
            </FrameActionButton>
            <FrameActionButton>
              Like
            </FrameActionButton>
          </div>
        </div>
   
    </CommonContainer>

  )

}