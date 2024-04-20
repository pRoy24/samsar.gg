import React from 'react';
import { ThirdwebProvider } from "thirdweb/react";
import PublicationHome from "./PublicationHome.js";

export default function PLanding(props) {
  const { meta } = props;
  return (
    <ThirdwebProvider>
      <PublicationHome meta={meta} />
    </ThirdwebProvider>
  )
}
