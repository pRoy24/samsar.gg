import React from "react";
import { FaSpinner } from "react-icons/fa6";
import { useUser } from "../../contexts/UserContext";

export default function CommonButton(props) {
  const { children , onClick, isPending, extraClasses} = props;
  const { user } = useUser();

  let isBtnDisabled = false;

  if (!user || !user.fid) {
    isBtnDisabled = true;
  }
  
  let pendingSpinner = <span />;
  if (isPending) {
    pendingSpinner = <FaSpinner className="animate-spin inline-flex ml-2" />;
  }

  return (
    <button onClick={onClick} className={`m-auto text-center min-w-16
    rounded-lg shadow-sm text-neutral-100 bg-green-800 pl-8 pr-8 pt-2 pb-2 text-bold
    cursor:pointer 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-green-800 disabled:text-neutral-100 ${extraClasses}`}
    disabled={isBtnDisabled}>
      {children}
      {pendingSpinner}
    </button>
  )
}