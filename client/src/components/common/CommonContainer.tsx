import React from "react";
import TopNav from "./TopNav.tsx";

export default function CommonContainer(props) {
  const { children } = props;

  return (
    <div className='h-[100vh] overflow-hidden'>
      <TopNav />
      <div>
        {children}
      </div>
    </div>
  )
}