"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* LEFT PANEL — FORM SIDE */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center justify-center bg-[#FFFFFF] px-6 py-12 md:p-12"
      >
        <div className="w-full max-w-sm">
          {/* TABS */}
          <div className="mb-10 flex gap-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`pb-2 font-bebas text-2xl transition-colors ${
                activeTab === "login"
                  ? "border-b-2 border-[#CC0000] text-black/90"
                  : "text-black/30"
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`pb-2 font-bebas text-2xl transition-colors ${
                activeTab === "register"
                  ? "border-b-2 border-[#CC0000] text-black/90"
                  : "text-black/30"
              }`}
            >
              REGISTER
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="flex flex-col"
              >
                <div className="mb-6 flex flex-col">
                  <label className="mb-2 font-bebas text-sm text-black/50">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    className="border-b border-black/20 pb-2 font-inter text-sm outline-none transition-colors focus:border-black/90 bg-transparent"
                  />
                </div>

                <div className="mb-2 flex flex-col">
                  <label className="mb-2 font-bebas text-sm text-black/50">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full border-b border-black/20 pb-2 pr-10 font-inter text-sm outline-none transition-colors focus:border-black/90 bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 text-black/40 hover:text-black/80 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                  <label className="group flex cursor-pointer items-center gap-2">
                    <input type="checkbox" className="accent-black" />
                    <span className="font-inter text-xs text-black/50 transition-colors group-hover:text-black/80">Remember me</span>
                  </label>
                  <button type="button" className="font-inter text-xs text-black/50 transition-colors hover:text-[#CC0000]">
                    Forgot password?
                  </button>
                </div>

                <button type="button" className="mt-6 bg-black py-3 font-bebas text-lg tracking-widest text-white transition-colors duration-300 hover:bg-[#CC0000]">
                  LOGIN
                </button>

                <div className="my-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-black/10" />
                  <span className="font-inter text-xs text-black/30">OR</span>
                  <div className="h-px flex-1 bg-black/10" />
                </div>

                <button type="button" className="flex w-full items-center justify-center gap-3 border border-black/10 py-3 font-inter text-sm text-black/70 transition-colors hover:border-black/30 hover:text-black/90">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20c11 0 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                    <path fill="#1976D2" d="M43.611 20.083L43.595 20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571c.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                  </svg>
                  Sign in with Google
                </button>

                <p className="mt-8 text-center font-inter text-sm text-black/50">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="font-bebas tracking-wide text-[#CC0000] transition-all hover:brightness-125"
                  >
                    REGISTER
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="flex flex-col"
              >
                <div className="mb-6 flex flex-col">
                  <label className="mb-2 font-bebas text-sm text-black/50">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    className="border-b border-black/20 pb-2 font-inter text-sm outline-none transition-colors focus:border-black/90 bg-transparent"
                  />
                </div>

                <div className="mb-6 flex flex-col">
                  <label className="mb-2 font-bebas text-sm text-black/50">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    className="border-b border-black/20 pb-2 font-inter text-sm outline-none transition-colors focus:border-black/90 bg-transparent"
                  />
                </div>

                <div className="mb-6 flex flex-col">
                  <label className="mb-2 font-bebas text-sm text-black/50">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full border-b border-black/20 pb-2 pr-10 font-inter text-sm outline-none transition-colors focus:border-black/90 bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 text-black/40 hover:text-black/80 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="mb-6 flex flex-col">
                  <label className="mb-2 font-bebas text-sm text-black/50">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full border-b border-black/20 pb-2 pr-10 font-inter text-sm outline-none transition-colors focus:border-black/90 bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-0 text-black/40 hover:text-black/80 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="button" className="mt-6 bg-black py-3 font-bebas text-lg tracking-widest text-white transition-colors duration-300 hover:bg-[#CC0000]">
                  CREATE ACCOUNT
                </button>

                <div className="my-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-black/10" />
                  <span className="font-inter text-xs text-black/30">OR</span>
                  <div className="h-px flex-1 bg-black/10" />
                </div>

                <button type="button" className="flex w-full items-center justify-center gap-3 border border-black/10 py-3 font-inter text-sm text-black/70 transition-colors hover:border-black/30 hover:text-black/90">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20c11 0 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                    <path fill="#1976D2" d="M43.611 20.083L43.595 20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571c.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                  </svg>
                  Sign up with Google
                </button>

                <p className="mt-8 text-center font-inter text-sm text-black/50">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="font-bebas tracking-wide text-[#CC0000] transition-all hover:brightness-125"
                  >
                    LOGIN
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* RIGHT PANEL — BRAND VISUAL SIDE */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative hidden items-center justify-center overflow-hidden bg-black md:flex"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#1a0000]" />
        
        <div className="relative z-10 flex flex-col items-center p-12 text-center">
          <Image
            src="/assets/Schault_icon_bgr.png"
            alt="Schault Logo"
            width={128}
            height={128}
            className="h-32 w-auto invert" // Invert for black bg
            priority
          />
          <h1 className="mt-8 font-bebas text-5xl tracking-widest text-white">
            SCHAULT
          </h1>
          <p className="mt-3 font-inter text-sm text-white/50">
            Replace parts. Not the entire shoe.
          </p>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center">
          <span className="font-bebas text-sm text-white/20">EST. 2024</span>
        </div>
      </motion.div>
    </div>
  );
}
