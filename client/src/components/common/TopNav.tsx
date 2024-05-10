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


import './common.css';
import { FaTwitter } from 'react-icons/fa6';


const PROCESSOR_SERVER = process.env.REACT_APP_PROCESSOR_API;

export default function TopNav(props) {

  const { resetCurrentSession } = props;
  const farcasterSignInButtonRef = useRef(null);

  const { openAlertDialog, closeAlertDialog } = useAlertDialog();

  const resetSession = () => {
    resetCurrentSession();
    closeAlertDialog();
  }

  const {  user, setUser } = useUser();
  const navigate = useNavigate();

  const [userProfileData, setUserProfileData] = useState({});

  let userProfile = <span />;

  const verifyAndSetUserProfile = (profile) => {
    axios.post(`${PROCESSOR_SERVER}/users/verify`, profile).then(function(dataRes) {
      console.log(dataRes);
      const userData = dataRes.data;
      const authToken = userData.authToken;
      localStorage.setItem('authToken', authToken);
      setUser(userData);
    
    })

    //setUserProfileData(profile);
  }




  const gotoUserAccount = () => {
    navigate('/account');

  }


  const siginToTwitter = () => {
    console.log('signing in to twitter');
    axios.get(`${PROCESSOR_SERVER}/users/twitter_login`).then(function(dataRes) {
      console.log(dataRes);
      const twitterAuthUrl = dataRes.data.authUrl;
      window.location.href = twitterAuthUrl;
    })

  }

  const showLoginDialog = () => {
    console.log('show login dialog');

    const loginComponent = (
      <div>
        <div className='flex flex-row text-center'>

        <div className='basis-1/2'>

          <div className='bg-green-800 text-neutral-100 p-2 rounded-lg cursor-pointer' onClick={() => siginToTwitter()}>
            <div className='flex'>
            <FaTwitter className='inline-flex' /> 
            <div className='inline-flex'>
            Twitter
              </div>
            </div>

      

           </div>

          </div>
          <div className='basis-1/2'>
 
            <SignInButton
              onSuccess={verifyAndSetUserProfile}
              ref={farcasterSignInButtonRef}
            />
          </div>

        </div>

      </div>
    )
    openAlertDialog(loginComponent);



  }

  if (user && user.fid) {
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
    rounded-lg shadow-sm text-neutral-100 bg-green-800 pl-8 pr-8 pt-2 pb-2 text-bold
    cursor:pointer' onClick={() => {showLoginDialog()}}>
        <IoMdLogIn className='inline-flex'/> Creator Login 
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
  let addFarcasterWallet = <span />;


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
            {addFarcasterWallet}
          </div>
          <div className='inline-flex'>
            {userProfile}
          </div>

        </div>
      </div>
    </div>
  );
}