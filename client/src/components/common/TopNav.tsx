import React, { useEffect, useState } from 'react';
import { SignInButton } from '@farcaster/auth-kit';
import { useSignIn } from '@farcaster/auth-kit';
import { useProfile } from '@farcaster/auth-kit';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext'
import CommonButton from './CommonButton.tsx';
import { useNavigate } from 'react-router-dom';
import { createSponsoredSigner } from '../../utils/pinata.js';
import QRCode from "react-qr-code";
import { useAlertDialog } from '../../contexts/AlertDialogContext.js';


const PROCESSOR_SERVER = process.env.REACT_APP_PROCESSOR_API;

export default function TopNav() {

  const {
    isAuthenticated,
    profile,
  } = useProfile();
  const { setAlertComponentHTML, openAlertDialog } = useAlertDialog();
  const { setUserApi, user, setUser } = useUser();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [userProfileData, setUserProfileData] = useState({});
  const [ isFarcasterSignupCompleted, setIsFarcasterSignupCompleted] = useState(true);


  const setUserProfile = (profile) => {
    if (!isProcessing) {
      setIsProcessing(true);
      setUserProfileData(profile);
    }
  }

  useEffect(() => {
    if (user && user.farcasterSignupStatus === 'PENDING') {
      checkFarcasterSignupStatus();
    }
  }, [user]);


  const checkFarcasterSignupStatus = () => {
    const payload = {
      fid: user.fid,
    }
    axios.post(`${PROCESSOR_SERVER}/users/poll_signer`, payload).then(function (res) {
      const resData = res.data;
      if (resData.status === "COMPLETED") {
        setIsFarcasterSignupCompleted(true);
      } else {
        setIsFarcasterSignupCompleted(false);
      }
    }).catch(function (err) {
      setIsFarcasterSignupCompleted(false);
    });
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

  const onClose = () => {

  }


  const startPollingForSigner = () => {
    const payload = {
      fid: user.fid,
    }
    const signerPoll = setInterval(() => {
      axios.post(`${PROCESSOR_SERVER}/users/poll_signer`, payload).then(function (res) {
        const resData = res.data;
        if (resData.status === "COMPLETED") {
          clearInterval(signerPoll);
          setAlertComponentHTML(<div>Signer Created</div>);
          //  window.location.reload();
        }

      }).catch(function (err) {
        clearInterval(signerPoll);
      });

    }, 5000);


  }

  const createConnectedWallet = () => {
    if (!user) {
      return;
    }
    const payload = {
      fid: user.fid,
    }
    axios.post(`${PROCESSOR_SERVER}/users/create_signer`, payload).then(function (res) {


      const { signer_id, deep_link_url, } = res.data;
      const componentData = <QRCode value={deep_link_url} />

      openAlertDialog(componentData, onClose);

      startPollingForSigner();


    })
    // createSponsoredSigner();
  }

  let userProfile = <span />;

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
    userProfile = (
      <SignInButton
        onSuccess={(profile) => setUserProfile(profile)}

      />
    )

  }

  let addFarcasterWallet = <span />;
  if (user && user.fid && (!user.faracsterTransactionToken || !isFarcasterSignupCompleted)) {


    addFarcasterWallet = (
      <CommonButton onClick={createConnectedWallet}>
        Add Connected Wallet
      </CommonButton>
    )
  }

  return (
    <div className='bg-green-600 h-[50px]'>
      <div className='grid grid-cols-4'>
        <div>
          <h1>SAMSAR</h1>
        </div>
        <div>

        </div>
        <div>
          <CommonButton onClick={createNewSession}>
            Create
          </CommonButton>
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