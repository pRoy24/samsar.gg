import React from "react";
import { FaTwitter, FaGithub } from "react-icons/fa";
import { SiFarcaster } from "react-icons/si";


export default function TopNav() {
  const gotoLink = (linkType) => {
    const githublink = 'https://github.com/pRoy24/samsar.gg';
    const twitterLink = 'https://twitter.com/samsar_gg';
    const farcasterLink = 'https://warpcast.com/samsar';

    if (linkType === "github") {
      window.open(githublink, '_blank')
    } else if (linkType === "twitter") {
      window.open(twitterLink, '_blank')
    } else if (linkType === "farcaster") {
      window.open(farcasterLink, '_blank')
    } else {
    }
  }
  return (
    <div className='bg-gradient-to-r from-green-700 to-green-400  h-[50px]'>
      <div className='grid grid-cols-4'>
        <div>
         <img src={'/logo.png'} />
        </div>
        <div>
          
        </div>

        <div>

        </div>

        <div className="m-auto text-center">
    
          <FaGithub className="inline-flex text-[26px] ml-2 mr-2" onClick={() => gotoLink("github")}/>
          <SiFarcaster className="inline-flex text-[26px] ml-2 mr-2" onClick={() => gotoLink("farcaster")}/>
          <FaTwitter className="inline-flex text-[26px] ml-2 mr-2 " onClick={() => gotoLink("twitter")}/>


        </div>

      </div>
    </div>
  )
}