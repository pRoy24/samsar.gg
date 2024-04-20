import React from 'react';
import { ThirdwebProvider } from "thirdweb/react";
import PublicationHome from "./PublicationHome.js";

export default function PLanding(props) {
  return (
    <ThirdwebProvider>
      <PublicationHome {...props} />
    </ThirdwebProvider>
  )
}
