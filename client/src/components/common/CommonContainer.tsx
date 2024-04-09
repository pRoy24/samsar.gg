import React from "react";
import TopNav from "./TopNav.tsx";

export default function CommonContainer(props) {
  const { children } = props;

  return (
    <div>
      <TopNav />
      <div>
        {children}
      </div>
    </div>
  )
}