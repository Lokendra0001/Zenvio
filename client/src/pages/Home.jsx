import ChatBox from "../components/ChatBox";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../components/SideBar";
import { LogOut } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import serverObj from "../config/serverObj";
import { handleErrorMsg, handleSuccessMsg } from "../config/toast";
import { logoutUser } from "../store/slices/userSlice";
import { addHistory } from "../store/slices/selectedHistory";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const [showLogout, setShowLogout] = useState(false);
  const { serverURL } = serverObj;
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${serverURL}/user/logout`, {
        withCredentials: true,
      });
      handleSuccessMsg(res.data.msg);
      dispatch(logoutUser());
      dispatch(addHistory(null));
    } catch (error) {
      handleErrorMsg(error.message);
    }
  };

  return (
    <div className="w-full h-[100dvh] overflow-hidden bg-zinc-900  grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 text-white">
      {/* Left Sidebar */}
      <SideBar />

      {/* Right Content (Header + ChatBox) */}
      <div className="h-[100dvh] flex flex-col  col-span-1 md:col-span-3 lg:col-span-4  bg-gradient-to-br from-zinc-900 to-zinc-800 ">
        {/* Header for login or User */}
        <div className="h-[9dvh]  flex justify-end items-center px-3 py-2.5  shadow-sm">
          {user ? (
            <div className="relative">
              <button
                // to="/profile"
                className="px-3 h-full flex items-center gap-2 cursor-pointer rounded-md font-medium text-sm hover:bg-zinc-700/50 transition-colors"
                onClick={() => setShowLogout(!showLogout)}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700 text-white shadow-sm">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="inline">{user.fullName.split(" ")[0]}</span>
              </button>
              {showLogout && (
                <button
                  className="absolute -bottom-12 right-1 flex gap-1 items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 rounded-md  text-sm font-medium  cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut size={17} className="animate-pulse" /> LogOut
                </button>
              )}
            </div>
          ) : (
            <NavLink
              to={"/login"}
              className="px-3 h-full grid place-items-center bg-zinc-700 hover:bg-zinc-600 cursor-pointer rounded-md font-medium text-sm"
            >
              Sign in
            </NavLink>
          )}
        </div>

        {/* ChatBox */}
        <div className="flex-1 overflow-hidden">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default Home;
