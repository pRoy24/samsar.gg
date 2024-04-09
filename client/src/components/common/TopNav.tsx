import React, { useEffect, useState } from 'react';
import { SignInButton } from '@farcaster/auth-kit';
import { useSignIn } from '@farcaster/auth-kit';
import { useProfile } from '@farcaster/auth-kit';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext'
import CommonButton from './CommonButton.tsx';
import { useNavigate } from 'react-router-dom';


const PROCESSOR_SERVER = process.env.REACT_APP_PROCESSOR_API;

export default function TopNav() {

  const {
    isAuthenticated,
    profile,
  } = useProfile();
  const { setUserApi, user } = useUser();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [userProfileData, setUserProfileData] = useState({});

  const setUserProfile = (profile) => {
    if (!isProcessing) {
      setIsProcessing(true);
      setUserProfileData(profile);
    }
  }

  useEffect(() => {
    if (isProcessing && userProfileData && userProfileData.fid) {
      setUserApi(userProfileData);
    }

  }, [isProcessing, userProfileData]);

  const createNewSession = () => {

    axios.post(`${PROCESSOR_SERVER}/sessions/create`, {
      fid: user.fid,
    }).then((res) => {
      console.log(res);
      navigate(`/session/${res.data._id}`, { replace: true });
      //  window.location.href = `/session/${res.data.id}`;
    }).catch((err) => {
      console.log(err);
    });
  }

  let userProfile = <span />;
  if (user && user.fid) {
    userProfile = (
      <div className='flex'>
        <div className='inline-flex text-lg mr-2'>
          <h1>{user.displayName}</h1>
        </div>

        <img src={user.pfpUrl} alt={user.username} className='w-[60px] rounded-[50%] inline-flex' />
      </div>
    );
  } else {
    const nonce = Math.random().toString(36).substring(7);
    userProfile = <SignInButton
      onSuccess={(profile) => setUserProfile(profile)}


    />

  }
  return (
    <div className='bg-emerald-500 h-[60px]'>
      <div className='grid grid-cols-4'>
        <div>
          <h1>TopNav</h1>
        </div>
        <div>

        </div>
        <div>
          <CommonButton onClick={createNewSession}>
            Create
          </CommonButton>

        </div>
        <div>
          {userProfile}
        </div>
      </div>
    </div>
  );
}