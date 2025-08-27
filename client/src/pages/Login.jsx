import {
  ArrowRight,
  ChevronRight,
  EyeClosed,
  EyeIcon,
  Loader2,
  LogIn,
} from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import serverObj from "../config/serverObj";
import { handleErrorMsg, handleSuccessMsg } from "../config/toast";
import { useDispatch } from "react-redux";
import { addUser } from "../store/slices/userSlice";

const fields = [
  {
    label: "Email Address",
    id: "email",
    type: "email",
    placeholder: "Email address",
    autoComplete: "email",
  },
  {
    label: "Password",
    id: "password",
    type: "password",
    placeholder: "Password",
    autoComplete: "current-password",
  },
];

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isPass, setIsPass] = useState(true);
  const [loading, setLoading] = useState(false);
  const { serverURL } = serverObj;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${serverURL}/user/signin`, data, {
        withCredentials: true,
      });
      handleSuccessMsg(res.data.msg);
      dispatch(addUser(res.data.user));

      navigate("/");
    } catch (err) {
      handleErrorMsg(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect the browser to your backend route
    window.location.href = `${serverURL}/user/google-login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-2">
      <div className="bg-zinc-800/90 backdrop-blur-sm border border-zinc-700 max-w-md w-full p-4 px-6 rounded-xl shadow-xl space-y-3">
        <div className="text-center">
          <div className="inline-flex text-xl text-white items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-zinc-600 to-zinc-700 mb-2 shadow-lg">
            Z
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-300">
            Zenvio.ai
          </h1>
          <p className="text-zinc-400">Sign in to your account</p>
        </div>

        <form className="space-y-2" onSubmit={handleSubmit(handleLogin)}>
          {fields.map(({ label, id, type, placeholder, autoComplete }) => (
            <div key={id} className="relative">
              <label className="ml-1 inline-block mb-1 text-sm font-medium text-zinc-300">
                {label}
              </label>
              <input
                id={id}
                type={id === "password" && !isPass ? "text" : type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                {...register(id, { required: `${label} is required` })}
                className="appearance-none block w-full px-3 py-2.5 border border-zinc-600 rounded-md shadow-sm placeholder-zinc-400 bg-zinc-700 text-zinc-100 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
              />
              {id === "password" && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 mt-1 text-zinc-400 cursor-pointer"
                  onClick={() => setIsPass(!isPass)}
                >
                  {isPass ? <EyeClosed size={20} /> : <EyeIcon size={20} />}
                </button>
              )}
              {errors[id] && (
                <p className="text-red-400 text-xs mt-1">
                  {errors[id]?.message}
                </p>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between my-3 text-sm">
            <label className="flex items-center text-zinc-300">
              <input type="checkbox" className="mr-2 accent-zinc-500" />
              Remember me
            </label>
            <a href="#" className="text-zinc-400 hover:text-zinc-200">
              Forgot password?
            </a>
          </div>

          <button className="w-full flex items-center justify-center transition-all gap-2 py-3 bg-gradient-to-r from-zinc-600 to-zinc-700 hover:from-zinc-700 hover:to-zinc-800 text-white hover:translate-y-0.5 cursor-pointer rounded-lg shadow-md ">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} /> Sign In...{" "}
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center ">
                <LogIn size={18} /> Sign In{" "}
              </span>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="underline text-zinc-300 hover:text-white"
          >
            Create one
          </Link>
        </div>

        <div className="relative mt-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-zinc-800 text-zinc-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full inline-flex justify-center py-2.5 px-4  rounded-md shadow-sm text-sm font-medium text-zinc-300 bg-gradient-to-r from-zinc-600 to-zinc-700 hover:from-zinc-700 hover:to-zinc-800"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
          <NavLink
            to={"/"}
            className=" self-end flex  items-center gap-1 cursor-pointer text-sm font-medium text-zinc-400 hover:text-zinc-300"
          >
            Skip for Now <ChevronRight size={15} />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
