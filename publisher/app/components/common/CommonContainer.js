import React from 'react';
import TopNav from './TopNav';

import { UserProvider } from '../../contexts/UserContext';
import { useColorMode } from '@/app/contexts/ColorModeContext';

export default function CommonContainer(props) {
  const { children } = props;
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'bg-neutral-100' : 'bg-gradient-to-r from-gray-900 via-cyber-black to-gray-900 text-neutral-900';
  return (

    <UserProvider>
    <div className={`font-sans ${bgColor} pb-8`}>
      <TopNav />
      {children}
    </div>
    </UserProvider>
 
  )
}