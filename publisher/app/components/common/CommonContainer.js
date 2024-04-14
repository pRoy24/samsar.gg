import React from 'react';
import TopNav from './TopNav';

export default function CommonContainer(props) {
  const { children } = props;
  return (
    <div className="">
      <TopNav />
      {children}
    </div>
  )
}