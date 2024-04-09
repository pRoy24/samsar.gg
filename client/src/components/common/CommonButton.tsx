import React from "react";

export default function CommonButton(props) {
  const { children , onClick} = props;
  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}