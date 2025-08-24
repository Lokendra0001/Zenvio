import { EditIcon, LockKeyhole, Menu, X } from "lucide-react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assests/images/logo.jpg";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col  border-r border-zinc-700 h-full">
      {/* Logo & NewChat */}
      <div className="border-b border-zinc-700 flex justify-between items-center h-[9dvh] px-4 pl-2">
        <span className="text-xl font-medium flex gap-1.5 items-center">
          <img src={logo} alt="Z" className="h-5.5" /> Zenvio
        </span>
        <div className="flex gap-3.5 select-none">
          <EditIcon
            size={20}
            className="text-gray-300 font-bold hover:text-white cursor-pointer"
          />
          {isOpen && (
            <X
              size={21.5}
              className="text-gray-400 font-bold hover:text-zinc-300 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
          )}
        </div>
      </div>

      {/* History Locked */}
      <div className="p-4 flex-1 flex items-center justify-center">
        <div className="text-center max-w-xs p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-600/20 via-zinc-400/10 to-zinc-600/20 animate-shine opacity-50 rounded-xl pointer-events-none"></div>

          <div className="w-12 h-12 rounded-full bg-zinc-700/60 flex items-center justify-center mb-4 border border-white/10">
            <LockKeyhole className="text-zinc-300 animate-pulse" size={20} />
          </div>

          <h3 className="text-zinc-200 font-medium text-sm mb-2">
            History Locked
          </h3>
          <p className="text-zinc-500 font-medium text-xs mb-4 leading-tight">
            Sign in to save and access your chat history
          </p>

          <NavLink
            to="/login"
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-medium transition-shadow shadow-md"
          >
            Sign In
          </NavLink>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex ">{sidebarContent}</div>

      {/* Mobile sidebar toggle */}
      <div
        className={`md:hidden fixed top-4 left-3 ${isOpen && "hidden"} z-50`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className=" text-zinc-400 hover:text-zinc-300 shadow-lg backdrop-blur-md  transition"
        >
          <HiOutlineMenuAlt2 size={24} />
        </button>
      </div>

      {/* Mobile sidebar drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-[85%] bg-zinc-900 h-full shadow-xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
