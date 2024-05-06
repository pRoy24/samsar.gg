import React from "react";
import CommonContainer from "../common/CommonContainer.tsx";
import { useEffect } from "react";
import EditorHome from "../editor/EditorHome.tsx";
import EditorLanding from '../editor/EditorLanding.tsx';
import UserAccount from "../account/UserAccount.tsx";
import ListProduct from "../product/ListProduct.tsx";
import PublicationHome from "../publication/PublicationHome.tsx";

import AppHome from "./AppHome.tsx";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";

import { Routes, Route } from 'react-router-dom';

const PROCESSOR_SERVER = process.env.REACT_APP_PROCESSOR_API;

export default function Home() {

  const { getUser, getUserAPI } = useUser();
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      //  window.location.href = "/login";
    } else {

      getUserAPI();

    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<EditorLanding />} />
        <Route path="/session/:id" element={<EditorHome />} />
        <Route path="/account" element={<UserAccount />} />
        <Route path="/publication/:id" element={<PublicationHome />} />
        {/* Add more routes as needed */}
      </Routes>

    </>
  );
}