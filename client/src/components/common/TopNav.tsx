import React, { useEffect, useState, useRef } from 'react';

import { SignInButton, useProfile, useSignIn } from '@farcaster/auth-kit';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext'
import CommonButton from './CommonButton.tsx';
import { useNavigate } from 'react-router-dom';
import { createSponsoredSigner } from '../../utils/pinata.js';
import QRCode from "react-qr-code";
import { useAlertDialog } from '../../contexts/AlertDialogContext';
import { IoMdLogIn } from "react-icons/io";
import { AlertDialog } from './AlertDialog.tsx';
import { SiFarcaster } from "react-icons/si";
import {
  ConnectButton,
} from "thirdweb/react";
import { client, wallets, getAuth, getAuthPayload, verifyAuthPayload } from '../../utils/thirdweb.js';

import { IoMdWallet } from "react-icons/io";


import './common.css';
import { FaTwitter } from 'react-icons/fa6';


const PROCESSOR_SERVER = process.env.REACT_APP_PROCESSOR_API;

export default function TopNav(props) {

  const { resetCurrentSession, addCustodyAddress } = props;
  const farcasterSignInButtonRef = useRef(null);

  const { openAlertDialog, closeAlertDialog } = useAlertDialog();

  const resetSession = () => {
    resetCurrentSession();
    closeAlertDialog();
  }

  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [userProfileData, setUserProfileData] = useState({});

  let userProfile = <span />;

  const verifyAndSetUserProfile = (profile) => {
    axios.post(`${PROCESSOR_SERVER}/users/verify`, profile).then(function (dataRes) {
      const userData = dataRes.data;
      const authToken = userData.authToken;
      localStorage.setItem('authToken', authToken);
      setUser(userData);

    })
  }

  const gotoUserAccount = () => {
    navigate('/account');
  }


  const siginToTwitter = () => {
    axios.get(`${PROCESSOR_SERVER}/users/twitter_login`).then(function (dataRes) {
      const authPayload = dataRes.data;
      const twitterAuthUrl = authPayload.loginUrl;
      window.open(twitterAuthUrl, '_blank');
    })
    closeAlertDialog();

  }

  const showLoginDialog = () => {
    const loginComponent = (
      <div>
        <div className='mt-4 mb-4 text-center font-bold'>
          Choose a social provider to login
        </div>

        <div className='flex flex-row text-center mb-4'>
          <div className='basis-1/2 pl-4 pr-4'>
            <div className='bg-emerald-800 text-neutral-100 p-2 rounded-lg cursor-pointer h-[50px]
            text-center m-auto' onClick={() => siginToTwitter()}>
              <div className='text-center text-lg font-bold pt-[2px]'>
                <FaTwitter className='inline-block mr-1' />
                <div className='inline-block'>
                  Twitter
                </div>

              </div>

            </div>
          </div>
          <div className='basis-1/2 pl-4 pr-4'>
            <SignInButton
              onSuccess={verifyAndSetUserProfile}
            />
          </div>
        </div>

      </div>
    )
    openAlertDialog(loginComponent);
  }



  if (user && user._id) {
    userProfile = (
      <div className='flex cursor' onClick={gotoUserAccount} >
        <div className='inline-flex text-lg mr-2'>
          <h1>{user.displayName}</h1>
        </div>

        <img src={user.pfpUrl} alt={user.username} className='w-[50px] rounded-[50%] inline-flex' />
      </div>
    );
  } else {
    const nonce = Math.random().toString(36).substring(7);
    userProfile = (
      <div className='mt-1'>
        <button className='m-auto text-center min-w-16
    rounded-lg shadow-sm text-neutral-100 bg-emerald-800 pl-8 pr-8 pt-1 pb-2 text-bold
    cursor:pointer font-bold text-lg' onClick={() => { showLoginDialog() }}>
          <IoMdLogIn className='inline-flex' /> Login
        </button>
      </div>
    )
  }

  const gotoHome = () => {
    const alertDialogComponent = (
      <div>
        <div>
          This will reset your current session. Are you sure you want to proceed?
        </div>
        <div className=' mt-4 mb-4 m-auto'>
          <div className='inline-flex ml-2 mr-2'>
            <CommonButton
              onClick={() => {
                resetSession();
              }}
            >
              Yes
            </CommonButton>
          </div>
          <div className='inline-flex ml-2 mr-2'>
            <CommonButton
              onClick={() => {
                closeAlertDialog();
              }}
            >
              No
            </CommonButton>
          </div>
        </div>
      </div>
    )
    openAlertDialog(alertDialogComponent);
  }
  let addSecondaryWallet = <span />;
  if (user && !user.custody) {

    const thirdwebAuth = getAuth();



    addSecondaryWallet = (
      <div className='mt-1'>
        <ConnectButton
          client={client}
          wallets={wallets}
          theme={"dark"}
          connectModal={{
            size: "wide",
            showThirdwebBranding: false,
          }}

          auth={{
            isLoggedIn: async (address) => {
              console.log("checking if logged in!", { address });

            },
            doLogin: async (params) => {
              console.log("logging in!");
              const verifiedData = await verifyAuthPayload(params);
              console.log(verifiedData);
              const { valid, payload } = verifiedData;
              if (valid) {
                const custodyAddress = payload.address;
                await addCustodyAddress(custodyAddress);
              }
            },
            getLoginPayload: async ({ address }) => {
              const qd = await getAuthPayload(address);
              return qd;
            }
          }}

        />
      </div>
    )
  }


  return (
    <div className='bg-gradient-to-r from-green-700 to-green-400  h-[50px] fixed w-[100vw] shadow-lg z-10'>
      <div className='grid grid-cols-4'>
        <div>
          <img src={'/logo.png'} className='cursor-pointer' onClick={() => gotoHome()} />
        </div>
        <div>

        </div>
        <div>

        </div>
        <div>
          <div className='inline-flex'>
            {addSecondaryWallet}
          </div>
          <div className='inline-flex'>
            {userProfile}
          </div>

        </div>
      </div>
    </div>
  );
}