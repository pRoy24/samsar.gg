import React from 'react';
import { ThirdwebProvider } from "thirdweb/react";
import PublicationHome from "./PublicationHome.js";
import { ColorModeProvider } from '@/app/contexts/ColorModeContext.js';

export default function PLanding(props) {
  return (
    <ThirdwebProvider>
      <ColorModeProvider>
        <PublicationHome {...props} />
      </ColorModeProvider>
    </ThirdwebProvider>
  )
}
