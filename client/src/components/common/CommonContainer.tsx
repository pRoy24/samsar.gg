import React, { useEffect } from "react";
import TopNav from "./TopNav.tsx";
import { AlertDialog } from "./AlertDialog.tsx";
import { useUser } from "../../contexts/UserContext";

export default function CommonContainer(props) {
  const { children } = props;

  const { getUserAPI } = useUser();

  const resetCurrentSession = () => {
    if (props.resetSession) {
      props.resetSession();
    
    }
  }
  useEffect(() => {
    const userFid = localStorage.getItem("fid");
    if (userFid) {
  
    }

  }, []);

  return (
    <div className='h-[100vh] overflow-hidden'>
      <TopNav resetCurrentSession={resetCurrentSession}/>
      <div>
        <AlertDialog />
        {children}
      </div>
    </div>
  )
}