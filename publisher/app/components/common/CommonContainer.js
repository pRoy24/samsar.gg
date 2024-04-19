import React from 'react';
import TopNav from './TopNav';
import { ThirdwebProvider } from "thirdweb/react";
import { UserProvider } from '../../contexts/UserContext';

export default function CommonContainer(props) {
  const { children } = props;
  return (
    <ThirdwebProvider>
    <UserProvider>
    <div className="font-sans">
      <TopNav />
      {children}
    </div>
    </UserProvider>
    </ThirdwebProvider>
  )
}