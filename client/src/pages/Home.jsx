import React from "react";
import { EditIcon, HistoryIcon, User } from "lucide-react";
import { FaHistory } from "react-icons/fa";
import logo from "../assests/images/logo.jpg";
import ChatBox from "../components/ChatBox";

const Home = () => {
  return (
    <div className="w-full h-[100dvh] bg-zinc-900 grid grid-cols-1 md:grid-cols-5 text-white">
      {/* Left Sidebar */}
      <div className="hidden md:block border-r border-zinc-700  ">
        {/* Sidebar content */}
        <div className="border-b border-gray-700 flex justify-between items-center h-[9dvh] px-4 pl-2">
          {/* Logo */}
          <span className="text-xl font-medium flex gap-1.5 items-center ">
            <img src={logo} alt="Z" className="h-5.5" /> Zenvio
          </span>
          {/* History and NewChat */}
          <div className="flex gap-3">
            <HistoryIcon
              size={21}
              className="text-gray-300 font-bold hover:text-white cursor-pointer"
            />
            <EditIcon
              size={21}
              className="text-gray-300 font-bold hover:text-white cursor-pointer"
            />
          </div>
        </div>
        <div>History....</div>
      </div>

      {/* Right Content (Header + ChatBox) */}
      <div className="h-[100dvh] flex flex-col  col-span-1 md:col-span-4  bg-gradient-to-br from-zinc-900 to-zinc-800 ">
        <div className="h-[9dvh]  flex justify-end items-center px-3 py-2.5">
          <button className="px-3 h-full bg-zinc-700 hover:bg-zinc-600 cursor-pointer rounded-md font-medium text-sm">
            Sign in
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default Home;
