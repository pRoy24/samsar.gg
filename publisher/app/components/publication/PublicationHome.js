import React, { useEffect, useState } from 'react';
import CommonContainer from '../common/CommonContainer.js';
import { useRouter } from 'next/router';
import FrameActionButton from '../common/FrameActionButton.js';
import { prepareMintTransaction, burnTransaction, getContractObject } from '../../../utils/ContractOperations.js';
import { HeartBit, useHeartBit , HeartBitProvider} from "@fileverse/heartbit-react";
import './publication.css';
import { FaTwitter } from 'react-icons/fa';
import { SiFarcaster } from "react-icons/si";

import { sendTransaction, readContract, prepareContractCall, toWei } from 'thirdweb';
import { useActiveAccount, useSendTransaction, useReadContract, useSwitchActiveWalletChain,  useActiveWalletChain} from "thirdweb/react";
import { CHAIN_DEFINITIONS } from '@/utils/constants.js';

const IPFS_BASE = process.env.NEXT_PUBLIC_IPFS_BASE;
const chainId = 84532;

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3005';

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER || 'http://localhost:3002';

export default function PublicationHome(props) {
  const [ currentView, setCurrentView ] = useState('details');
  const { meta , tokenId } = props;
  const [onChainMeta, setOnChainMeta] = useState(null);
  const [currentChain, setCurrentChain] = useState(null);

  const router = useRouter();
  const activeAccount = useActiveAccount();
  const contract = getContractObject();
  const { mutate: sendTransaction, isPending } = useSendTransaction();
  const page = router.query.id;
  const pageTokens = page.split('_');
  const tokenIdN = pageTokens[1];

  const coreOptions = {
    chain: "0xaa36a7"
  }

  const mintNFTTransaction = async () => {

    setCurrentView('details');

    const transaction = prepareContractCall({
      contract,
      method: "function mint(uint256 tokenId)",
      params: [tokenId],
    });
    sendTransaction(transaction);
  }

  const burnNFTTransaction = async () => {
    setCurrentView('details');
    const transaction = prepareContractCall({
      contract,
      method: "burn",
      params: [tokenId, 1],
    });
    sendTransaction(transaction);
  }

  useEffect(() => {
    if (meta.generationHash) {
      const metaFileURL = `${IPFS_BASE}${meta.metadataHash}`;
      console.log(metaFileURL);
      fetch(metaFileURL)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setOnChainMeta(data);
        });
    }

    fetch(`${API_SERVER}/publications/token_info?id=${tokenId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
 
      });


  }, []);


  let descriptionBlock = <span />;
  if (onChainMeta) {
    descriptionBlock = (
      <div className="">
        <div className='font-bold'>{onChainMeta.name}</div>
        <p> {onChainMeta.description}</p>
      </div>
    )
  }
  let heartbeatHash = `ipfs://${meta.imageHash}`;

  const getSignatureArgsHook = async () => {

    const address = activeAccount.address;
    const message = `Samsar ${tokenId} ${chainId}`

    const signature = await activeAccount.signMessage({ 'message': message });

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

  if (activeWalletChain && chainId && activeWalletChain.id !== chainId) {

   const newChain = CHAIN_DEFINITIONS.find(chain => chain.id.toString() === chainId.toString());
   switchChain(newChain);
    //switchChain(chainId);
  }

  const gotoFarcasterLink = () => {
    const currentLink = window.location.href;
    const message = 'Check out this NFT on Samsar.gg';
    const farcasterURL = `https://warpcast.com/~/compose?text=${message}&embeds[]=${currentLink}`;
    window.open(farcasterURL, '_blank');
  }

  const gotoTwitterLink = () => {
    const currentLink = window.location.href;
    const message = 'Check out this NFT on Samsar.gg';
    const twitterURL = `https://twitter.com/intent/tweet?text=${message}&url=${currentLink}`;
    window.open(twitterURL, '_blank');
  }

  const showNFTINfo = () => {
    setCurrentView('info');
  }

  let currentDetailImage = <img src={`${IPFS_BASE}${meta.imageHash}`} className="m-auto w-[640px]" />;
  if (currentView === 'info') {
    currentDetailImage = (
      <img src={`${API_SERVER}/price/${tokenId}.png`} className="m-auto w-[640px]" />
    )
  }
  
  return (
    <CommonContainer>
      <div className="w-[640px] m-auto p-4 bg-slate-50 mt-2 rounded-lg border-2 border-color-neutral-400 shadow-lg">
        <div>
          <div className='flex flex-row w-full'>
            <div className='basis-3/4'>
            {descriptionBlock}
            </div>
            <div className='basis-1/4 '>
                <div className='inline-flex ml-2 mr-2 text-[30px]' onClick={gotoFarcasterLink}>
                  <SiFarcaster />
                </div>
                <div className='inline-flex ml-2 mr-2 text-[30px]' onClick={gotoTwitterLink}>
                <FaTwitter />
                </div>
              </div>
          </div>
        </div>
        <div>
          {currentDetailImage}
        </div>
        <p>{meta.description}</p>
        <div className="grid grid-cols-3 gap-1">
        <FrameActionButton onClick={mintNFTTransaction}>
            Mint
          </FrameActionButton>
          <FrameActionButton onClick={burnNFTTransaction}>
            Burn
          </FrameActionButton>
          <FrameActionButton onClick={showNFTINfo}>
            Info
          </FrameActionButton>
        </div>
      </div>
    </CommonContainer>
  )
}
