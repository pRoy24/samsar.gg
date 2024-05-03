import React, { useEffect, useState } from 'react';

import { SignInButton, useProfile, useSignIn } from '@farcaster/auth-kit';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext'
import CommonButton from './CommonButton.tsx';
import { useNavigate } from 'react-router-dom';
import { createSponsoredSigner } from '../../utils/pinata.js';
import QRCode from "react-qr-code";
import { useAlertDialog } from '../../contexts/AlertDialogContext';



const PROCESSOR_SERVER = process.env.REACT_APP_PROCESSOR_API;

export default function TopNav(props) {

  const { resetCurrentSession } = props;




  const { openAlertDialog, closeAlertDialog } = useAlertDialog();

  const resetSession = () => {
    resetCurrentSession();
    closeAlertDialog();
  }

  const { setUserApi, user, setUser } = useUser();
  const navigate = useNavigate();

  const [userProfileData, setUserProfileData] = useState({});

  let userProfile = <span />;

  const setUserProfile = (profile) => {
    setUserProfileData(profile);

  }

  useEffect(() => {
    if (userProfileData && userProfileData.fid) {
      setUserApi(userProfileData);
    }
  }, [userProfileData]);


  if (user && user.fid) {
    userProfile = (
      <div className='flex'>
        <div className='inline-flex text-lg mr-2'>
          <h1>{user.displayName}</h1>
        </div>

        <img src={user.pfpUrl} alt={user.username} className='w-[50px] rounded-[50%] inline-flex' />
      </div>
    );
  } else {
    const nonce = Math.random().toString(36).substring(7);
    userProfile = <SignInButton
      onSuccess={(profile) => setUserProfile(profile)}
    />


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