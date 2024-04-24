// UserContext.js
import React, { useState, useContext, createContext } from 'react';


const AlertDialogContext = createContext({
  isAlertDialogOpen: false,
  alertDialogContent: null,
  openAlertDialog: (data, fn) => {},
  closeAlertDialog: () => {},
  alertDialogSubmit: null,
  setAlertComponentHTML: (data) => {},

});

export const AlertDialogProvider = ({ children }) => {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertDialogContent, setDialogContent] = useState(null);
  const [alertDialogSubmit, setAlertDialogSubmit] = useState(null);
  const [alertComponentData, setAlertComponentData] = useState(<span />);

  const openAlertDialog = (content, onsubmit) => {

    setDialogContent(content);
    setAlertDialogSubmit(onsubmit);
    setIsAlertDialogOpen(true);
  };

  const closeAlertDialog = () => {
    setIsAlertDialogOpen(false);
    setDialogContent(null);
  };

  const setAlertComponentHTML = (html) => {
    setAlertComponentData(html);
  }

  return (
    <AlertDialogContext.Provider value={{ isAlertDialogOpen, alertDialogContent, openAlertDialog,
     closeAlertDialog,  setAlertComponentHTML }}>
      {children}
    </AlertDialogContext.Provider>
  );
};


export const useAlertDialog = () => useContext(AlertDialogContext);