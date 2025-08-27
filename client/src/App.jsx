import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import serverObj from "./config/serverObj";
import { addUser, logoutUser } from "./store/slices/userSlice";
import axios from "axios";
import { handleSuccessMsg } from "./config/toast";

const App = () => {
  const [authLoading, setAuthLoading] = useState(true);
  const { serverURL } = serverObj;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverURL}/user/getCurrentUser`, {
          withCredentials: true,
        });
        dispatch(addUser(res.data.user));
        handleSuccessMsg(res.data.msg);
      } catch (err) {
        dispatch(logoutUser());

      } finally {
        setTimeout(() => {
          setAuthLoading(false);
        }, 1000);
      }
    };

    fetchUser();
  }, []);

  if (authLoading)
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="relative">
          {/* Main AI core with gradient */}
          <div className="w-16 h-16 bg-gradient-to-br from-zinc-600 via-zinc-500 to-zinc-400 rounded-lg transform rotate-45 animate-pulse-glow"></div>

          {/* Floating particles with different trajectories */}
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-zinc-300 rounded-full animate-orbital-1"></div>
          <div className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-zinc-400 rounded-full animate-orbital-2"></div>
          <div className="absolute -bottom-2 -right-2 w-1 h-1 bg-zinc-500 rounded-full animate-orbital-3"></div>
          <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-zinc-300 rounded-full animate-orbital-4"></div>

          {/* Digital pulse effect */}
          <div className="absolute inset-0 border border-zinc-500/20 rounded-lg animate-digital-pulse"></div>
        </div>
      </div>
    );

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "text-sm rounded-md shadow-lg ",
          duration: 2000,
          style: {
            background: "#3f3f46",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#10b981", // Tailwind green-500
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // Tailwind red-500
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
};

export default App;
