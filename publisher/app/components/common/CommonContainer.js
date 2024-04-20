import React from 'react';
import TopNav from './TopNav';

import { UserProvider } from '../../contexts/UserContext';

export default function CommonContainer(props) {
  const { children } = props;
  return (

    <UserProvider>
    <div className="font-sans">
      <TopNav />
      {children}
    </div>
    </UserProvider>
 
  )
}