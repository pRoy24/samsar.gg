import React, { useEffect, useState } from 'react';
import CommonContainer from '../common/CommonContainer.js';
import { useRouter } from 'next/router';
import FrameActionButton from '../common/FrameActionButton.js';
import { prepareMintTransaction, burnTransaction, getContractObject } from '../../../utils/ContractOperations.js';
import { HeartBit, useHeartBit , HeartBitProvider} from "@fileverse/heartbit-react";
import './publication.css';

import { sendTransaction, readContract, prepareContractCall, toWei } from 'thirdweb';
import { useActiveAccount, useSendTransaction, useReadContract, useSwitchActiveWalletChain,  useActiveWalletChain} from "thirdweb/react";
import { CHAIN_DEFINITIONS } from '@/utils/constants.js';

const IPFS_BASE = 'https://cloudflare-ipfs.com/ipfs/';

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3005';

export default function PublicationHome(props) {
  const { meta , tokenId, chainId } = props;
  const [onChainMeta, setOnChainMeta] = useState(null);
  const [currentChain, setCurrentChain] = useState(null);

  const router = useRouter();
  const activeAccount = useActiveAccount();
  const contract = getContractObject(chainId);
  const { mutate: sendTransaction, isPending } = useSendTransaction();
  const page = router.query.id;
  const pageTokens = page.split('_');
  const tokenIdN = pageTokens[1];


  const { data, isLoading } = useReadContract({
    contract,
    method: "currentMintPrice",
    params: [tokenIdN],
  });

  const coreOptions = {
    chain: "0xaa36a7"
  }

  const mintNFTTransaction = async () => {

    const transaction = prepareContractCall({
      contract,
      method: "function mint(uint256 tokenId)",
      params: [tokenId],
    });
    sendTransaction(transaction);
  }

  const burnNFTTransaction = async () => {
    const transaction = prepareContractCall({
      contract,
      method: "burn",
      params: [tokenId, 1],
    });
    sendTransaction(transaction);
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
  let heartbeatHash = `ipfs://${meta.imageHash}`;

  const getSignatureArgsHook = async () => {


    const address = activeAccount.address;


    const message = `Samsar ${tokenId} ${chainId}`

    const signature = await activeAccount.signMessage({ 'message': message });

    console.log(signature);

    return {
      message,
      signature,
      onMintCallback: () => {
        console.log("Minted!")
      }
    };
  };

  const switchChain = useSwitchActiveWalletChain();
  const activeWalletChain = useActiveWalletChain();

  console.log(activeWalletChain);
  console.log(chainId);

  if (activeWalletChain && chainId && activeWalletChain.id !== chainId) {
   const newChain = CHAIN_DEFINITIONS.find(chain => chain.id.toString() === chainId.toString());
   console.log("NEW CHAIN");
   console.log(CHAIN_DEFINITIONS);
    console.log(newChain);
   switchChain(newChain);
    //switchChain(chainId);
  }

  
  return (

    <CommonContainer>
      <div className="w-[640px] m-auto p-4 bg-slate-50 mt-2 rounded-lg border-2 border-color-neutral-400 shadow-lg">
        <div>
          {descriptionBlock}
        </div>
        <img src={`${IPFS_BASE}${meta.imageHash}`} className="m-auto w-[640px]" />
        <p>{meta.description}</p>
        <div className="grid grid-cols-4 gap-1">
        <FrameActionButton onClick={mintNFTTransaction}>
            Mint
          </FrameActionButton>
          <FrameActionButton onClick={burnNFTTransaction}>
            Burn
          </FrameActionButton>
          <FrameActionButton>
            Info
          </FrameActionButton>
          <div className='bg-slate-300 boder-2 border-slate-900 text-slate-800 rounded-md p-2'>
            <HeartBit coreOptions={coreOptions}
              getSignatureArgsHook={getSignatureArgsHook}
              hash={heartbeatHash}
              showTotalMintsByHash={true}
              className="m-auto"
            />
          </div>
        </div>
      </div>
    </CommonContainer>
  )
}
