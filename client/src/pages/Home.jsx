import ChatBox from "../components/ChatBox";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import SideBar from "../components/SideBar";

const Home = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="w-full h-[100dvh] overflow-hidden bg-zinc-900  grid grid-cols-1 md:grid-cols-5 text-white">
      {/* Left Sidebar */}
      <SideBar />

      {/* Right Content (Header + ChatBox) */}
      <div className="h-[100dvh] flex flex-col  col-span-1 md:col-span-4  bg-gradient-to-br from-zinc-900 to-zinc-800 ">
        {/* Header for login or User */}
        <div className="h-[9dvh]  flex justify-end items-center px-3 py-2.5  shadow-sm">
          {user ? (
            <NavLink
              to="/profile"
              className="px-3 h-full flex items-center gap-2 cursor-pointer rounded-md font-medium text-sm hover:bg-zinc-700/50 transition-colors"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700 text-white shadow-md">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline">
                {user.fullName.split(" ")[0]}
              </span>
            </NavLink>
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
