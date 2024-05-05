import React from "react";
import axios from "axios";
import Head from 'next/head';
import { FrameMetadata } from '@coinbase/onchainkit/frame';
import '@/app/globals.css';
import PLanding from "@/app/components/publication/PLanding.js";

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
  
  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        
        <FrameMetadata
          buttons={[
            {
              label: 'Mint',
              action: 'tx',
              target: `${HOST_URL}/api/frame/get-mint-tx?id=${tokenId}`,
              postUrl: `${HOST_URL}/api/frame/get-pending-tx?id=${tokenId}&imageHash=${meta.imageHash}`
            },
            {
              label: 'Burn',
              action: 'tx',
              target: `${HOST_URL}/api/frame/get-burn-tx?id=${tokenId}`,
              postUrl: `${HOST_URL}/api/frame/get-pending-tx?id=${tokenId}&imageHash=${meta.imageHash}`
            },
            {
              label: 'Info',
              action: 'post',
              target: `${HOST_URL}/api/frame/get-info?id=${tokenId}`
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
      <PLanding meta={meta}
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