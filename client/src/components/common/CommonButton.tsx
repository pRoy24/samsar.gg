import React from "react";

export default function CommonButton(props) {
  const { children , onClick, isPending} = props;
  console.log(isPending);
  console.log("BATTERY");
  
  return (
    <button onClick={onClick} className="m-auto text-center min-w-16
    rounded-lg shadow-sm text-neutral-100 bg-green-800 pl-4 pr-4 pt-2 pb-2 text-bold">
      {children}
    </button>
  )
}