import { ArrowRight, EyeClosed, EyeIcon, LogIn } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import serverObj from "../config/serverObj";
import { handleErrorMsg, handleSuccessMsg } from "../config/toast";
import { useDispatch } from "react-redux";
import { addUser } from "../store/slices/userSlice";

const fields = [
  {
    label: "Full Name",
    id: "fullName",
    type: "text",
    placeholder: "Full Name",
    autoComplete: "name",
  },
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
    autoComplete: "new-password",
  },
];

const Signup = () => {
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

  const handleSignUp = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post(`${serverURL}/user/signup`, data, {
        withCredentials: true,
      });
      handleSuccessMsg(res.data.msg);
      dispatch(addUser(res.data.user));

      navigate("/");
    } catch (err) {
      handleErrorMsg(err.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-2">
      <div className="bg-zinc-800/90 backdrop-blur-sm border border-zinc-700 max-w-md w-full p-4 px-6 rounded-xl shadow-xl space-y-6">
        <div className="text-center">
          <div className="inline-flex text-xl text-white items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-zinc-600 to-zinc-700 mb-2 shadow-lg">
            Z
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-300">
            Zenvio.ai
          </h1>
          <p className="text-zinc-400">Create your account to get started</p>
        </div>

        <form className="space-y-2" onSubmit={handleSubmit(handleSignUp)}>
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

          <label className="flex items-center text-sm text-zinc-300 my-3">
            <input type="checkbox" className="mr-2 accent-zinc-500" />I agree to{" "}
            <a
              href="#"
              className="underline text-zinc-400 hover:text-zinc-200 ml-1"
            >
              Terms & conditions
            </a>
          </label>

          <button className="w-full flex items-center justify-center transition-all gap-2 py-3 bg-gradient-to-r from-zinc-600 to-zinc-700 hover:from-zinc-700 hover:to-zinc-800 text-white hover:translate-y-0.5 cursor-pointer rounded-lg shadow-md">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} /> Creating
                account...{" "}
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center ">
                <LogIn size={18} /> Create Account
              </span>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-zinc-500 ">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline text-zinc-300 hover:text-white"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
