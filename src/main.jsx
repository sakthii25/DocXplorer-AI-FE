import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import TestBot from "./Pages/TestBot";
import ApiKey from "./Pages/APIKey";
import './index.css';
import { Toaster } from 'sonner';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Toaster/>
    <Routes>
      <Route path="/" element={<Login/>}/> 
      <Route path="/home" element={<Home/>}/>
      <Route path="/test" element={<TestBot/>}/>
      <Route path="/apikeys" element={<ApiKey/>}/>
    </Routes>
  </BrowserRouter>
);
