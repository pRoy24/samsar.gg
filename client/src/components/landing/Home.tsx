import React from "react";
import CommonContainer from "../common/CommonContainer.tsx";
import { useEffect } from "react";
import EditorHome from "../editor/EditorHome.tsx";
import ListProduct from "../product/ListProduct.tsx";
import AppHome from "./AppHome.tsx";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";

import { Routes, Route } from 'react-router-dom';

const PROCESSOR_SERVER = process.env.REACT_APP_PROCESSOR_API;

export default function Home() {

  const { getUser, getUserAPI } = useUser();
  useEffect(() => {
    const fid = localStorage.getItem("fid");
    if (!fid) {
      //  window.location.href = "/login";
    } else {

      getUserAPI();

    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<AppHome />} />
        <Route path="/session/:id" element={<EditorHome />} />
        {/* Add more routes as needed */}
      </Routes>

    </>
  );
}