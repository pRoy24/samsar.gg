import React from "react";
import Landing from "@/app/components/home/Landing";
import Head from 'next/head';
import '@/app/globals.css';

import { GetServerSideProps } from 'next';

export const getServerSideProps = async (context) => {
  return {
    redirect: {
      destination: 'https://app.samsar.gg',  // Replace with your target URL
      permanent: true,  // Set to true if this is a permanent redirection
    }
  };
};

export default function Index() {
  return (
    <div>
      <Head>
        <title>Society for Advancement of Memery, Shitposting, Analytics and Reasoning </title>
        <meta property="og:title" content="Society for Advancement of Memery, Shitposting, Analytics and Reasoning." />
        <meta name="description" content="Open-source AI enabled image-editor with tokenized incentives and on-chain verifiability of original-content." />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.samsar.gg" />
        <meta property="og:image" content="https://www.samsar.gg/og_img.png" />
        <meta property="og:description" content="Open-source AI enabled image-editor with tokenized incentives and on-chain verifiability of original-content." />

      </Head>
      
  
    </div>
  )
}

