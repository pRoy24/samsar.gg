import React from "react";
import axios from "axios";
import Head from 'next/head';
import { FrameMetadata } from '@coinbase/onchainkit/frame';
import '@/app/globals.css';
import GLanding from "@/app/components/generation/GLanding.js";

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3005';

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER || 'http://localhost:3002';
const IMAGE_BASE = `${API_SERVER}/generations/`;
const IPFS_BASE = process.env.NEXT_PUBLIC_IPFS_BASE;

export default function Page(props) {
  const { meta, id } = props;

  const tokenId = id;
  let imgSrc = ``;
  if (meta.imageHash) {
    imgSrc = `${IPFS_BASE}${meta.imageHash}`;
  }
  
  const title = meta.name ? meta.name : "Samsar GG Publication";
  const description = meta.description ? meta.description : "Samsar GG Publication";
  const twitterImage = meta.twitterOGImage ? meta.twitterOGImage : imgSrc;

  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <link rel="icon" href="/favicon.png" type="image/x-icon" />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://samsar.g/p/${id}`} />
        <meta property="og:image" content={twitterImage} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="Samsar GG" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@samsar_gg" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={twitterImage} />
        <meta name="twitter:creator" content="@samsar_gg" />
        <meta property="og:logo" content={`${HOST_URL}/logo.png`} />


        <FrameMetadata
          buttons={[
            {
              label: 'Mint',
              action: 'tx',
              target: `${HOST_URL}/api/frame/get-mint-tx?id=${tokenId}`,
            },
            {
              label: 'Burn',
              action: 'tx',
              target: `${HOST_URL}/api/frame/get-burn-tx?id=${tokenId}`,
            },
            {
              label: 'Info',
              action: 'post',
              target: `${HOST_URL}/api/frame/get-info?id=${tokenId}&imageHash=${meta.imageHash}`
            },
          ]}
          image={{
            src: imgSrc,
            aspectRatio: '1:1'
          }}
          state={{
            imageHash: meta.imageHash,
          }}
          postUrl={`${HOST_URL}/api/frame/get-pending-tx?id=${tokenId}&imageHash=${meta.imageHash}`}

        />
      </Head>
      <GLanding meta={meta}
        tokenId={tokenId}
      />
    </div>
  )

}

export async function getStaticPaths() {
  const { data } = await axios.get(`${API_SERVER}/publications/list`);
  const paths = data.map((product) => ({
    params: { id: product.slug },
  }));

  return { paths: paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const res = await fetch(`${API_SERVER}/publications/get_meta?id=${id}`);
  const productMeta = await res.json();
  return { props: { meta: productMeta, id: id } };
}
