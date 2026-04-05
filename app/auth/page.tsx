"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 md:p-8">
      {/* Back Arrow to Home */}
      <Link 
        href="/" 
        className="fixed left-6 top-6 z-50 rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:bg-white active:scale-95 md:left-12 md:top-12"
        aria-label="Back to Home"
      >
        <ArrowLeft size={24} className="text-[#CC0000]" />
      </Link>

      {/* Full Page White Background */}
      <div className="absolute inset-0 z-0 bg-white" />

      {/* Star Border Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-[1024px] rounded-[2rem] p-[3px] overflow-hidden shadow-[0_8px_48px_rgba(0,0,0,0.5)]"
      >
        {/* Dual Synchronized Border Beams (The Stars) */}
        <div 
          className="absolute inset-[-150%] z-0 animate-[spin_6s_linear_infinite]"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, transparent 310deg, rgba(204, 0, 0, 1) 340deg, transparent 350deg)"
          }}
        />
        <div 
          className="absolute inset-[-150%] z-0 animate-[spin_6s_linear_infinite]"
          style={{
            background: "conic-gradient(from 180deg, transparent 0deg, transparent 310deg, rgba(204, 0, 0, 1) 340deg, transparent 350deg)"
          }}
        />

        {/* Glassmorphism 2-Column Card (The Mask) */}
        {/* We use rounded-[calc(2rem-3px)] to perfectly match the 3px padding of the wrapper */}
        <div className="relative z-10 flex w-full overflow-hidden rounded-[calc(2rem-3px)] bg-white/70 shadow-2xl backdrop-blur-3xl">

          {/* LEFT PANEL: Form Section */}
          <div className="flex w-full flex-col justify-center bg-white/80 p-8 md:w-1/2 md:p-14 lg:px-16 lg:py-16 text-black">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex w-full flex-col"
                >
                  <h1 className="font-serif text-4xl text-black/90 sm:text-[2.75rem] sm:leading-tight">
                    Welcome !
                  </h1>
                  <p className="mt-1 font-inter text-[20px] text-black/80">
                    Sign in to
                  </p>

                  <form className="mt-8 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-inter text-[13px] font-medium text-black/80">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="yoglazy@12345.com"
                        className="rounded-[0.5rem] border border-black/10 bg-white/60 px-4 py-3.5 font-inter text-sm outline-none transition-all placeholder:text-black/40 focus:border-[#CC0000] focus:bg-white focus:ring-1 focus:ring-[#CC0000]/20 text-black"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-inter text-[13px] font-medium text-black/80">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••"
                          className="w-full rounded-[0.5rem] border border-black/10 bg-white/60 px-4 py-3.5 pr-12 font-inter text-sm outline-none transition-all placeholder:text-black/40 focus:border-[#CC0000] focus:bg-white focus:ring-1 focus:ring-[#CC0000]/20 text-black"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50 transition-colors hover:text-[#CC0000]"
                        >
                          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <label className="group flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-black/20 text-[#CC0000] accent-[#CC0000] transition-all focus:ring-[#CC0000]"
                        />
                        <span className="font-inter text-[13px] font-medium text-black/80 transition-colors group-hover:text-[#CC0000]">
                          Remember me
                        </span>
                      </label>
                      <button
                        type="button"
                        className="font-inter text-[13px] text-[#A0A0A0] transition-colors hover:text-[#CC0000]"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="button"
                      className="mt-3 rounded-[0.5rem] bg-[#CC0000] py-3.5 font-inter text-[15px] font-medium text-white shadow-md transition-all hover:bg-[#A30000] active:scale-[0.98]"
                    >
                      Login
                    </button>

                    <button
                      type="button"
                      className="mt-1 flex w-full items-center justify-center gap-3 rounded-[0.5rem] border border-black/10 bg-white/60 py-3.5 font-inter text-[15px] font-medium text-[#5088E8] shadow-sm transition-all hover:bg-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        className="h-5 w-5"
                      >
                        <path
                          fill="#FFC107"
                          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20c11 0 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                        />
                        <path
                          fill="#FF3D00"
                          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                        />
                        <path
                          fill="#4CAF50"
                          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                        />
                        <path
                          fill="#1976D2"
                          d="M43.611 20.083L43.595 20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571c.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                        />
                      </svg>
                      Sign in with Google
                    </button>

                    <p className="mt-4 text-center font-inter text-[13px] text-black/50">
                      Don't have an Account ?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="font-bold text-[#CC0000] drop-shadow-sm transition-colors hover:text-[#FF3333] hover:underline"
                      >
                        Register
                      </button>
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex w-full flex-col"
                >
                  <h1 className="font-serif text-4xl text-black/90 sm:text-[2.75rem] sm:leading-tight">
                    Welcome !
                  </h1>
                  <p className="mt-1 font-inter text-[20px] text-black/80">
                    Register for SCHAULT
                  </p>

                  <form className="mt-8 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-inter text-[13px] font-medium text-black/80">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        className="rounded-[0.5rem] border border-black/10 bg-white/60 px-4 py-3.5 font-inter text-sm outline-none transition-all placeholder:text-black/40 focus:border-[#CC0000] focus:bg-white focus:ring-1 focus:ring-[#CC0000]/20 text-black"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-inter text-[13px] font-medium text-black/80">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="rounded-[0.5rem] border border-white/50 bg-white/60 px-4 py-3.5 font-inter text-sm outline-none transition-all placeholder:text-black/40 focus:border-[#CC0000] focus:bg-white focus:ring-1 focus:ring-[#CC0000]/20 text-black"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-inter text-[13px] font-medium text-black/80">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••"
                          className="w-full rounded-[0.5rem] border border-white/50 bg-white/60 px-4 py-3.5 pr-12 font-inter text-sm outline-none transition-all placeholder:text-black/40 focus:border-[#CC0000] focus:bg-white focus:ring-1 focus:ring-[#CC0000]/20 text-black"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50 transition-colors hover:text-[#CC0000]"
                        >
                          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-6 rounded-[0.5rem] bg-[#CC0000] py-3.5 font-inter text-[15px] font-medium text-white shadow-md transition-all hover:bg-[#A30000] active:scale-[0.98]"
                    >
                      Register
                    </button>

                    <p className="mt-4 text-center font-inter text-[13px] text-black/50">
                      Already have an Account ?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="font-bold text-[#CC0000] drop-shadow-sm transition-colors hover:text-[#FF3333] hover:underline"
                      >
                        Login
                      </button>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT PANEL: Video Visual Asset with White Backdrop and Partition */}
          <div className="relative hidden w-1/2 flex-1 items-center justify-center bg-white/80 md:flex border-l border-black/10">
            <div className="relative h-full w-full">
              <video
                src="/assets/login-page-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
