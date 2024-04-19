import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import FrameActionButton from "../common/FrameActionButton.js";

const PROCESSOR_SERVER = process.env.NEXT_PUBLIC_API_SERVER;

export default function PublicationList() {
  const [productList, setProductList] = useState([]);
  const router = useRouter();
  useEffect(() => {
    axios.get(`${PROCESSOR_SERVER}/publications/list`).then(function (response) {
      console.log(response.data);
      setProductList(response.data);
      
    }).catch(function (error) {

    });
  }, []);

  const gotoPublicationPage = (product) => {

    router.replace(`/p/${product._id}`)
  }

  let productListDisplay = <span />;
  if (productList.length > 0) {
    productListDisplay = productList.map((product, index) => {
      return (
        <div key={index} className="p-4 bg-slate-50 border-2 border-slate-300">
            <img src={`https://cloudflare-ipfs.com/ipfs/${product.imageHash}`} className="cursor-pointer" onClick={() => gotoPublicationPage(product)} />
            <div className="grid grid-cols-3 gap-1">
              <FrameActionButton>
                Mint
              </FrameActionButton>
              <FrameActionButton>
                Burn
              </FrameActionButton>
              <FrameActionButton>
                Info
              </FrameActionButton>
            </div>
        </div>
      );
    });
  }
  return (
    <div className="overflow-y-scroll h-auto">
      <div className="m-auto text-lg font-bold mt-4 mb-4">Latest</div>
      <div className="grid grid-cols-3 gap-2">
        {productListDisplay}
      </div>
    </div>
  );
}