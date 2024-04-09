import React from "react";
import axios from "axios";
import { FrameMetadata } from '@coinbase/onchainkit/frame';
import '@/app/globals.css';

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER || 'http://localhost:3002';
const IMAGE_BASE = `${API_SERVER}/generations/`;
const IPFS_BASE = 'https://cloudflare-ipfs.com/ipfs/';

export default function Page(props) {
  console.log("INSIDE PAGE");
  console.log(props);
  const { meta } = props;

  return (
    <div>
      <FrameMetadata
        buttons={[
          {
            label: 'Tell me the story',
          },
          {
            action: 'link',
            label: 'Link to Google',
            target: 'https://www.google.com'
          },
          {
            action: 'post_redirect',
            label: 'Redirect to cute pictures',
          },
        ]}
        image={{
          src: IPFS_BASE,
          aspectRatio: '1:1'
        }}
        input={{
          text: 'Tell me a boat story',
        }}
        state={{
          counter: 1,
        }}
        postUrl="https://zizzamia.xyz/api/frame"
      />

      <div className="m-auto">


        <div className="text-center">
        <h1>Page Page</h1>
        </div>
  
        <div className="w-[512px] m-auto">
          <h2>{meta.title}</h2>
          <img src={`${IPFS_BASE}${meta.imageHash}`} className="m-auto" style={{ width: '512px' }} />

          <p>{meta.description}</p>
          <div className="grid grid-cols-4">
            <div>
              Mint
            </div>
            <div>
              Tip
            </div>
            <div>
              Like
            </div>
            <div>
              Info
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export async function getStaticPaths() {
  const { data } = await axios.get(`${API_SERVER}/products/list`);
  const paths = data.map((product) => ({
    params: { id: product._id },
  }));

  return { paths: paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { id } = params;


  // Fetch data using the 'id'
  const res = await fetch(`${API_SERVER}/products/get_meta?id=${id}`);
  const productMeta = await res.json();

  // Pass the post data to the page via props
  return { props: { meta: productMeta } };
}