import React, { useEffect, useState } from "react";
import axios from "axios";

const PROCESSOR_SERVER = process.env.REACT_APP_PROCESSOR_API;

export default function ListProduct() {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    axios.get(`${PROCESSOR_SERVER}/publications/list`).then(function (response) {
      console.log(response.data);
      setProductList(response.data);
      
    }).catch(function (error) {

    });
  }, []);

  let productListDisplay = <span />;
  if (productList.length > 0) {
    productListDisplay = productList.map((product, index) => {
      return (
        <div key={index}>
            <img src={`https://cloudflare-ipfs.com/ipfs/${product.imageHash}`} className=""/>
        </div>
      );
    });
  }
  return (
    <div>
      <h1>Product List</h1>
      <div className="grid grid-cols-4">
        {productListDisplay}
      </div>
    </div>
  );
}