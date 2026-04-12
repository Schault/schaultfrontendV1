"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      router.push("/profile");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F5] px-6">
      <div className="w-full max-w-md bg-white p-10 shadow-sm border border-black/5">
        <div className="mb-2 h-0.5 w-12 bg-[#CC0000]" aria-hidden />
        <h1 className="font-bebas text-4xl tracking-wide text-black/90 mt-4 mb-2">Update Password</h1>
        <p className="font-inter text-sm text-black/60 mb-8">
          Enter your new password below.
        </p>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-xs font-inter font-semibold mb-2 uppercase tracking-wide text-black/80">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full border-b border-black/20 pb-2 pr-10 font-inter text-black focus:border-black focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-black/50 transition-colors hover:text-[#CC0000] pb-2"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 bg-black py-4 font-inter text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-black/90 disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
