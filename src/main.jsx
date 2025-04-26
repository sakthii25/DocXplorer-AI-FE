import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./Pages/Login";
import Core from "./Pages/Core";
import './index.css';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}/> 
      <Route path="/documents" element={<Core/>}/>
    </Routes>
  </BrowserRouter>
);
