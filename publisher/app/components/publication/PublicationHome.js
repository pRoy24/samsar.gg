import React, { useEffect, useState } from 'react';
import CommonContainer from '../common/CommonContainer.js';

import FrameActionButton from '../common/FrameActionButton.js';
import { prepareMintTransaction, burnTransaction, getContractObject } from '../../../utils/ContractOperations.js';

import './publication.css';
import { FaExternalLinkAlt, FaLink, FaTwitter } from 'react-icons/fa';
import { SiFarcaster } from "react-icons/si";

import { sendTransaction, readContract, prepareContractCall, toWei } from 'thirdweb';
import { useActiveAccount, useSendTransaction, useReadContract, useSwitchActiveWalletChain, useActiveWalletChain } from "thirdweb/react";
import { CHAIN_DEFINITIONS } from '@/utils/constants.js';


const IPFS_BASE = process.env.NEXT_PUBLIC_IPFS_BASE;
const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || 84532;

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3005';

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER || 'http://localhost:3002';

export default function PublicationHome(props) {
  const [currentView, setCurrentView] = useState('details');
  const { meta, tokenId } = props;

  const [onChainMeta, setOnChainMeta] = useState(null);

  const activeAccount = useActiveAccount();
  const contract = getContractObject();
  const { mutate: sendTransaction, isPending } = useSendTransaction();


  const { data, isLoading } = useReadContract({
    contract,
    method: 'currentMintPrice',
    params: [tokenId],
  });


  const mintNFTTransaction = async () => {

    setCurrentView('details');

    const mintPrice = await readContract({
      contract,
      method: 'currentMintPrice',
      params: [tokenId],
    });


    const transaction = prepareContractCall({
      contract,
      method: "mint",
      params: [tokenId],
      value: mintPrice.toString(),
    });
    sendTransaction(transaction);

  }

  const burnNFTTransaction = async () => {
    setCurrentView('details');
    const transaction = prepareContractCall({
      contract,
      method: "burn",
      params: [tokenId],
    });
    sendTransaction(transaction);
  }

  useEffect(() => {
    if (meta.generationHash) {
      const metaFileURL = `${IPFS_BASE}${meta.metadataHash}`;

      fetch(metaFileURL)
        .then(response => response.json())
        .then(data => {
          setOnChainMeta(data);
        });
    }

  }, []);


  let descriptionBlock = <span />;
  if (onChainMeta) {
    descriptionBlock = (
      <div className="cursor-pointer" onClick={() => (setCurrentView('details'))}>
        <div className='font-bold'>
          {onChainMeta.name}
        </div>
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
  }

  const gotoFarcasterLink = () => {
    const currentLink = window.location.href;
    const message = `${meta.nftName} created by @${meta.creatorHandle}`;

    const farcasterURL = `https://warpcast.com/~/compose?text=${message}&embeds[]=${currentLink}`;
    window.open(farcasterURL, '_blank');
  }

  const gotoTwitterLink = () => {
    const currentLink = window.location.href;


    const message = `${meta.nftName} via @samsar_gg`;
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

  const witnessList = meta.witnessList || [];
  const witnessListLength = witnessList.length;

  if (currentView === 'witness') {
    currentDetailImage = (
      <div>
        <div>
          <div className='text-[14px] font-bold text-gray-800 ml-1 mt-2  mb-2'>Witnessed {witnessListLength} intermediate images</div>
        </div>
        <div className='grid grid-cols-3 cols-gap-1 mt-2 mb-2'>
          {meta.witnessList.map((witness, index) => {
            return (
              <div >
                <img src={`${API_SERVER}/intermediates/${witness.image}`} />
                <a href={`https://scan.witness.co/leaf/${witness.hash}`} target='_blank'>
                  <div className='overflow-hidden font-gray-950 text-xs mt-1 mb-1 flex underline cursor-pointer'>

                    <div className='inline-block w-[90%] overflow-hidden pl-1 pr-1'>
                      {witness.hash}
                    </div>
                    <div className='inline-flex w-[8%]'>
                      <FaExternalLinkAlt className='inline-flex' />
                    </div>

                  </div>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    )
  }


  let witnessStrength = <span />;
  if (witnessListLength > 0) {
    if (witnessListLength < 2) {
      witnessStrength = (
        <div>
          <div className='w-[40px] h-[16px] bg-red-500 text-white text-[12px] rounded-lg text-center inline-flex'>
          </div>
          <div className='inline-flex text-xs align-text-top ml-1 tracking-tight'>
            {witnessListLength} intermediates
          </div>
        </div>
      )
    } else if (witnessListLength < 5) {
      witnessStrength = (
        <div>
          <div className='w-[40px] h-[16px] bg-yellow-500 text-white text-[12px] rounded-lg text-center inline-flex'>
          </div>
          <div className='inline-flex text-xs align-text-top ml-1 tracking-tight'>
            {witnessListLength} intermediates
          </div>
        </div>
      )
    
    } else {
      witnessStrength = (
        <div>
          <div className='w-[40px] h-[16px] bg-green-500 text-white text-[12px] rounded-lg text-center inline-flex'>
          </div>
          <div className='inline-flex text-xs align-text-top ml-1 tracking-tight'>
            {witnessListLength} intermediates
          </div>
        </div>
      )
    }

  }
  return (
    <CommonContainer>
      <div className="w-[640px] m-auto pt-1 p-4 bg-slate-50 mt-2 rounded-lg border-2 border-color-neutral-400 shadow-lg">
        <div>
          <div className='flex flex-row w-full'>
            <div className='basis-1/4'>
              {descriptionBlock}
            </div>
            <div className='basis-1/4 pt-1'>
              <div className='text-[14px] text-gray-950 cursor-pointer'>
                <a href={`https://warpcast.com/${meta.creatorHandle}`} target='_blank'>
                  @{meta.creatorHandle}
                </a>
              </div>
              <div className="text-xs font-bold text-gray-800">
                Creator
              </div>
            </div>
            <div className='basis-1/4 pt-1'>
              <div onClick={() => setCurrentView('witness')} >
                <div className='text-[14px] text-gray-950 cursor-pointer'>
                  {witnessStrength}
                </div>
                <div className="text-xs font-bold text-gray-800">

                  Witness <FaLink className='inline-flex' />

                </div>
              </div>

            </div>
            <div className='basis-1/4 '>
              <div className='mt-2'>
                <div className='inline-flex ml-2 mr-2 text-[30px] cursor-pointer' onClick={gotoFarcasterLink}>
                  <SiFarcaster />
                </div>
                <div className='inline-flex ml-2 mr-2 text-[30px] cursor-pointer' onClick={gotoTwitterLink}>
                  <FaTwitter />
                </div>
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
