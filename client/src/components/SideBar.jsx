import { EditIcon, LockKeyhole, Menu, X } from "lucide-react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import React, { useDebugValue, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assests/images/logo4.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import serverObj from "../config/serverObj";
import { toggleNewChat } from "../store/slices/newChatSlice";
import { addHistory } from "../store/slices/selectedHistory";
import { handleErrorMsg } from "../config/toast";

const SideBar = () => {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const { serverURL } = serverObj;
  const dispatch = useDispatch();

  const handleFetchAllHistory = async () => {
    try {
      const { data } = await axios.get(`${serverURL}/chat/getHistory`, {
        withCredentials: true,
      });
      setHistory([...data].reverse());
    } catch (err) {
      handleErrorMsg(err.message);
    }
  };

  const handleNewChat = () => {
    dispatch(toggleNewChat());
    setTimeout(() => {
      handleFetchAllHistory();
    }, 1000);
  };

  useEffect(() => {
    if (user) {
      handleFetchAllHistory();
    }
  }, []);

  const sidebarContent = (
    <div className="flex flex-col w-full border-r border-zinc-700 h-full">
      {/* Logo & NewChat */}
      <div className="border-b border-zinc-700 flex justify-between items-center h-[9dvh] px-4 pl-2">
        <NavLink
          to={"/"}
          className="text-xl font-medium flex gap-1.5 items-center"
        >
          <img src={logo} alt="Z" className="h-5.5" /> Zenvio
        </NavLink>
        <div className="flex gap-3.5 select-none">
          <span title="New Chat">
            <EditIcon
              size={20}
              className="text-gray-300 font-bold hover:text-white cursor-pointer"
              onClick={handleNewChat}
            />
          </span>
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
      {!user ? (
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
      ) : history.length > 0 ? (
        <div className="grid gap-2 p-2">
          {history.map((item, i) => (
            <div
              key={i}
              className="py-2 px-2 border-b rounded-md border-zinc-800 hover:bg-white/5 cursor-pointer transition-colors "
              onClick={() => {
                dispatch(addHistory(history[i]));
                setIsOpen(false);
              }}
            >
              <p className="text-zinc-200 text-sm font-medium mb-1.5 line-clamp-1">
                {item.chats[0]?.msg.charAt(0).toUpperCase() +
                  item.chats[0]?.msg.slice(1) || "New conversation"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-zinc-500 text-sm">No chat history yet</p>
        </div>
      )}
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
            className="w-[80%] bg-zinc-900 h-full shadow-xl p-2"
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
