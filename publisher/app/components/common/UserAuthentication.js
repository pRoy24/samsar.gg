import React from 'react';
import { createThirdwebClient } from 'thirdweb';
import { AutoConnect, ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_ID;

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID
});

// list of wallets that your app uses
const wallets = [
  inAppWallet(),
  createWallet("io.metamask"),
  createWallet("me.rainbow"),
];


export default function UserAuthentication() {
  return (
    <div>
      <div>
        <ConnectButton
          wallets={wallets}
          client={client}

        />
      </div>
    </div>
  )
}