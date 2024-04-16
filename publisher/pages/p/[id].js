import React from "react";
import axios from "axios";
import Head from 'next/head';
import { FrameMetadata } from '@coinbase/onchainkit/frame';
import '@/app/globals.css';
import PublicationHome from "@/app/components/publication/PublicationHome.js";


const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3005';

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER || 'http://localhost:3002';
const IMAGE_BASE = `${API_SERVER}/generations/`;
const IPFS_BASE = 'https://cloudflare-ipfs.com/ipfs/';

export default function Page(props) {

  const { meta } = props;

  return (
    <div>
      <Head>
        <FrameMetadata
          buttons={[
            {
              label: 'Mint',
              action: 'tx',
              target: `${HOST_URL}/api/frame/get-mint-tx`
            },
            {
              label: 'Burn',
              action: 'tx',
              target: `${HOST_URL}/api/frame/get-burn-tx`
            },
            {
              label: 'Info',
              action: 'post_redirect',
            },
          ]}
          image={{
            src: `${IPFS_BASE}${meta.imageHash}`,
            aspectRatio: '1:1'
          }}
          state={{
            counter: 1,
          }}
          postUrl="https://zizzamia.xyz/api/frame"
        />
      </Head>

  

          <PublicationHome meta={meta} />
 
    </div>
  )

}

export async function getStaticPaths() {
  const { data } = await axios.get(`${API_SERVER}/publications/list`);
  const paths = data.map((product) => ({
    params: { id: product._id },
  }));

  return { paths: paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { id } = params;


  // Fetch data using the 'id'
  const res = await fetch(`${API_SERVER}/publications/get_meta?id=${id}`);
  const productMeta = await res.json();

  // Pass the post data to the page via props
  return { props: { meta: productMeta } };
}