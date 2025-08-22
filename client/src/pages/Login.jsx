import { ArrowRight, ChevronRight, LogIn } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign-in logic here
    console.log("Google sign-in attempt");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex select-none  justify-center py-12 px-2 sm:px-6 lg:px-8">
      <div className="  bg-zinc-800/90 backdrop-blur-sm flex flex-col justify-between py-5 px-4 max-w-md border border-zinc-700 w-full shadow sm:rounded-lg sm:px-10">
        <div className="text-center mb-4">
          <div className="inline-flex text-xl text-white items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-zinc-600 to-zinc-700 mb-2 shadow-lg">
            Z
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-300">
            Zenvio.ai
          </h1>
          <p className="text-zinc-400">Create your account to get started</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-300"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-zinc-600 rounded-md shadow-sm placeholder-zinc-400 bg-zinc-700 text-zinc-100 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-300"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-zinc-600 rounded-md shadow-sm placeholder-zinc-400 bg-zinc-700 text-zinc-100 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-zinc-600 accent-blue-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-zinc-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-zinc-400 hover:text-zinc-300"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center cursor-pointer gap-1 py-2.5 px-4  rounded-md  text-sm font-medium text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none "
            >
              <LogIn size={18} /> Sign in
            </button>
          </div>
        </form>

        <div>
          <div className="text-zinc-500 text-sm mb-1 mt-3">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="text-zinc-300/80 hover:text-zinc-200 underline"
            >
              Create account
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
              className="w-full inline-flex justify-center py-2 px-4 border border-zinc-600 rounded-md shadow-sm bg-zinc-700 text-sm font-medium text-zinc-300 hover:bg-zinc-600"
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
    </div>
  );
};

export default Login;
