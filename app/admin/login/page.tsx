"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if a valid Supabase session already exists
    const checkExistingSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Verify admin role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'admin') {
          router.push("/admin");
        }
      }
    };

    checkExistingSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("PLEASE FILL IN ALL FIELDS");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error("AUTHENTICATION FAILED. PLEASE CHECK YOUR CREDENTIALS.");
        setIsLoading(false);
        return;
      }

      // Verify admin role immediately after login
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        await supabase.auth.signOut();
        toast.error("UNAUTHORIZED: ADMIN ACCESS REQUIRED");
        setIsLoading(false);
        return;
      }

      toast.success("AUTHENTICATION SUCCESSFUL");
      setTimeout(() => {
        router.push("/admin");
      }, 500);
    } catch (err: any) {
      toast.error("AUTHENTICATION SYSTEM ERROR");
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
 
        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-[0.2em] text-[#71717a] uppercase">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
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
          SECURE PROTOCOL V2.0 • SUPABASE AUTHENTICATED
        </div>
      </div>
    </div>
  );
}
