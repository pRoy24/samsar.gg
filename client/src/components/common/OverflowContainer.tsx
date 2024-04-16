import React, { useEffect } from "react";
import TopNav from "./TopNav.tsx";
import { AlertDialog } from "./AlertDialog.tsx";
import { useUser } from "../../contexts/UserContext";

export default function OverflowContainer(props) {
  const { children } = props;

  const { getUserAPI } = useUser();

  useEffect(() => {
    const userFid = localStorage.getItem("fid");
    if (userFid) {
  
    }

  }, []);

  return (
    <div className='h-[100vh] overflow-y-auto'>
      <TopNav />
      <div>
        <AlertDialog />
        {children}
      </div>
    </div>
  )
}