import React, { useEffect, useState } from 'react';
import { FaExternalLinkAlt } from "react-icons/fa";

export default function Section1(props) {
  const { gotoCreatorApp } = props;
  return (
    <div className="flex align-center m-auto ">
      <div className="w-full">
        <div className="text-[30px] text-center mt-[20px] mb-8">
          <span className='text-green-700 font-bold'>S</span>ociety for&nbsp;
          <span className='text-green-700 font-bold'>A</span>dvanced&nbsp;
          <span className='text-green-700 font-bold'>M</span>emery,&nbsp;
          <span className='text-green-700 font-bold'>S</span>hitposting,&nbsp;
          <span className='text-green-700 font-bold'>A</span>nalytics and&nbsp;
          <span className='text-green-700 font-bold'>R</span>easoning&nbsp;
        </div>
        <div className='w-[400px] m-auto align-center text-center'>
 
            <button className='bg-gray-200 rounded-lg w-full h-[80px] shadow-lg' onClick={gotoCreatorApp}>
              <div className='text-xl font-bold '>
              Go To App <FaExternalLinkAlt className="inline-block ml-2" />
              <div className='text-xs font-normal'>
                Pre-alpha release. For testing only.
              </div>
              </div>
             
            </button>
     
        </div>
        <div className='w-[400px] m-auto align-center text-center'>

          <div className="text-lg mt-8 text-center mb-2">
            <div className='block'>
              <span className="text-[28px] inline-block">
                <div className='mt-2'>
                  Participant in
                </div>

              </span>
              <span className='inline-block'>
                <img src={'./ethGlobal.svg'} className="inline-flex ml-2 h-[58px] mt-[-10px]" />
              </span>
            </div>
          </div>



          <div className="text-lg mt-2 text-center mb-8 ">

            <img src={'https://storage.googleapis.com/ethglobal-api-production/events%2Fsvei0%2Flogo%2F1700304430711_events_of2r2_logo_1671503482706_scaling-ethereum-square-logo.svg'}
              className="h-[64px] ml-2 inline-flex " />
            <div className='inline-flex align-top pt-1'>
              <div className='text-left'>
                <div>
                  <span className='text-[26px] ml-4 mr-2'>Scaling Ethereum 2024</span>
                </div>
                <div className='ml-4 text-[26px] pl-1 mt-2'>
                  <CountdownTimer targetDate="2024-04-21T00:00:00" />
                </div>
              </div>


            </div>

            <div className='mt-2'>

            </div>

          </div>

        </div>


      </div>


    </div>
  )
}


function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    // Update the countdown timer every second
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference < 0) {
        clearInterval(interval);
        setTimeLeft("Countdown finished!");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className='text-[14px]  text-gray-950 leading-[1em]'>
      <div className=''>
        <span className='font-bold '>
        {timeLeft}
        </span> to deadline
      </div>
    </div>
  );
}
