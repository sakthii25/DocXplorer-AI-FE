import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import TestBot from "./Pages/TestBot";
import ApiKey from "./Pages/APIKey";
import ProtectedRoute from "./components/ProtectedRoute";
import './index.css';
import { Toaster } from 'sonner';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <GoogleOAuthProvider clientId="624900351596-f8vdqicse3q2vh3stk01p9h5fo9fdp3b.apps.googleusercontent.com">
    <BrowserRouter>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Login/>}/> 
        <Route path="/home" element={<ProtectedRoute> <Home/> </ProtectedRoute>}/>
        <Route path="/test" element={<ProtectedRoute> <TestBot/> </ProtectedRoute>}/>
        <Route path="/apikeys" element={<ProtectedRoute> <ApiKey/> </ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>

);
