"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if session is already active and valid
    const authSession = localStorage.getItem("schault_admin_session");
    if (authSession) {
      try {
        const { expiry } = JSON.parse(authSession);
        if (new Date().getTime() < expiry) {
          router.push("/admin");
        } else {
          localStorage.removeItem("schault_admin_session");
        }
      } catch (e) {
        localStorage.removeItem("schault_admin_session");
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("PLEASE FILL IN ALL FIELDS");
      setIsLoading(false);
      return;
    }

    // Normalized email
    const cleanEmail = email.trim().toLowerCase();
    
    // Whitelisted emails - checks standard whitelist and credentials
    // Fallback if env variable is not set
    const whitelist = ["admin@schault.com", "superadmin@schault.com", "mohit@schault.com", "design@schault.com"];
    
    // We allow standard username "admin" as well for backward compatibility, mapping it to admin@schault.com
    const isWhitelisted = whitelist.includes(cleanEmail) || cleanEmail === "admin";
    const isValidPassword = password === "admin" || password === "admin123" || password === "schault2026";

    if (isWhitelisted && isValidPassword) {
      // Create session with 8-hour expiry
      const sessionExpiry = new Date().getTime() + 8 * 60 * 60 * 1000;
      const sessionData = {
        email: cleanEmail === "admin" ? "admin@schault.com" : cleanEmail,
        expiry: sessionExpiry,
      };

      localStorage.setItem("schault_admin_session", JSON.stringify(sessionData));
      // For legacy components
      localStorage.setItem("admin_auth", "true");

      toast.success("AUTHENTICATION SUCCESSFUL");
      setTimeout(() => {
        router.push("/admin");
      }, 500);
    } else {
      toast.error("INVALID CREDENTIALS OR NOT WHITELISTED");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f1f1f1] p-6 text-black font-inter">
      <div className="w-full max-w-md border border-[#e4e4e7] bg-white p-8 shadow-xl">
        {/* Brand Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-black/5 border border-black/10 rounded-full">
            <Image
              src="/assets/logo.webp"
              alt="Schault Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>
          <h1 className="text-xl font-bold tracking-[0.3em] text-black">SCHAULT</h1>
          <p className="mt-2 text-[10px] font-semibold tracking-[0.25em] text-[#71717a]">
            INTERNAL ADMIN PANEL
          </p>
        </div>
 
        {/* Credentials Tip */}
        <div className="mb-6 border border-[#e4e4e7] bg-[#fafafa] p-4 text-[10px] text-[#52525b] tracking-[0.1em] uppercase leading-relaxed font-mono">
          <p className="font-semibold text-black/60 mb-1">AUTHORIZED DEMO ACCESS:</p>
          <p>EMAIL: <span className="text-black font-mono">admin@schault.com</span></p>
          <p>PASS: <span className="text-black font-mono">admin123</span></p>
        </div>
 
        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-[0.2em] text-[#71717a] uppercase">
              EMAIL ADDRESS
            </label>
            <input
              type="text"
              placeholder="ENTER REGISTERED EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#e4e4e7] bg-white px-4 py-3 text-xs tracking-wider text-black placeholder-[#a1a1aa] outline-none transition-all focus:border-black font-mono uppercase"
            />
          </div>
 
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-[0.2em] text-[#71717a] uppercase">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="ENTER SECURE PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#e4e4e7] bg-white px-4 py-3 text-xs tracking-wider text-black placeholder-[#a1a1aa] outline-none transition-all focus:border-black font-mono"
            />
          </div>
 
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black py-3.5 text-xs font-bold tracking-[0.25em] text-white transition-all hover:bg-zinc-800 disabled:opacity-50"
          >
            {isLoading ? "AUTHENTICATING..." : "AUTHENTICATE"}
          </button>
        </form>
 
        <div className="mt-8 text-center text-[9px] font-semibold tracking-[0.2em] text-[#a1a1aa] uppercase">
          SECURE PROTOCOL V1.0 • PRIVILEGED ACCESS ONLY
        </div>
      </div>
    </div>
  );
}
