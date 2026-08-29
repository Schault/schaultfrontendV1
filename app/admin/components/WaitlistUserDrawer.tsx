"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";

// 2. Waitlist User Drawer
interface WaitlistUserDrawerProps {
  user: any;
  waitlist: any[];
  setWaitlist: React.Dispatch<React.SetStateAction<any[]>>;
  onClose: () => void;
  updateWaitlistUserStatus?: (userId: number | string, status: string) => Promise<boolean>;
}

export default function WaitlistUserDrawer({ user, waitlist, setWaitlist, onClose, updateWaitlistUserStatus }: WaitlistUserDrawerProps) {
  const [notifyState, setNotifyState] = useState(user.notified_status);

  const handleSaveUser = async () => {
    if (updateWaitlistUserStatus && notifyState !== user.notified_status) {
      await updateWaitlistUserStatus(user.id, notifyState);
    } else {
      setWaitlist(prev => prev.map(w => {
        if (w.id === user.id) {
          return { ...w, notified_status: notifyState };
        }
        return w;
      }));
      toast.success(`WAITLIST LOG MODIFIED FOR ${user.name.toUpperCase()}`);
    }
    onClose();
  };

  const simulateResendMail = () => {
    toast.success(`LAUNCH NOTIFICATION TRIGGERED TO ${user.email.toUpperCase()}`);
    setNotifyState("Email Sent");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex justify-end font-inter"
    >
      <div className="absolute inset-0 z-0" onClick={onClose} />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.25 }}
        className="w-full max-w-md bg-white border-l border-[#e4e4e7] h-full z-10 flex flex-col justify-between shadow-xl"
      >
        <div>
          {/* Header */}
          <div className="p-6 border-b border-[#e4e4e7] flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 block uppercase">SUBSCRIBER CARD</span>
              <span className="text-base font-black tracking-widest text-black uppercase block mt-1">{user.name}</span>
            </div>
            <button onClick={onClose} className="p-1 border border-[#e4e4e7] text-zinc-500 hover:text-black bg-white hover:bg-zinc-50 shadow-sm">
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Lead metrics */}
            <div className="border border-[#e4e4e7] p-4 bg-zinc-50 space-y-3 font-mono text-xs">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest font-mono">META DATA FIELDS</span>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">EMAIL:</span>
                  <span className="text-black select-all">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">PHONE NO:</span>
                  <span className="text-black select-all">{user.phone || "UNSPECIFIED"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">JOIN REGION:</span>
                  <span className="text-black font-sans font-bold">{user.city || "UNKNOWN"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">SHOE SIZE:</span>
                  <span className="text-black font-sans font-bold">{user.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">GENDER BIAS:</span>
                  <span className="text-black font-sans font-bold">{user.gender}</span>
                </div>
              </div>
            </div>

            {/* Subscriber information */}
            <div className="border border-[#e4e4e7] p-4 bg-zinc-50 shadow-sm">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest font-mono mb-3">SUBSCRIBER SPECIFICATION</span>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-zinc-100 border border-[#e4e4e7] flex items-center justify-center font-mono font-bold text-xs text-zinc-500">
                  SH-X
                </div>
                <div className="font-mono text-[10px]">
                  <span className="text-black block font-sans font-bold text-xs">{user.name}</span>
                  <span className="text-zinc-500 block uppercase mt-0.5">SIZE: {user.size} • SYSTEM: MODULAR v1.0</span>
                </div>
              </div>
            </div>

            {/* Notification settings */}
            <div className="space-y-4">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest font-mono">NOTIFICATION STATUS</span>
              <div className="flex gap-2">
                <select
                  value={notifyState}
                  onChange={(e) => setNotifyState(e.target.value)}
                  className="bg-white border border-[#e4e4e7] text-[10px] px-3 py-2 text-black outline-none w-full uppercase font-mono tracking-widest focus:border-black shadow-sm"
                >
                  <option value="Not Notified">Not Notified</option>
                  <option value="Email Sent">Email Sent</option>
                  <option value="SMS Sent">SMS Sent</option>
                  <option value="Converted to Order">Converted to Order</option>
                </select>
                <button
                  onClick={simulateResendMail}
                  className="border border-[#e4e4e7] hover:bg-zinc-50 px-3 py-2 text-[9px] font-extrabold tracking-widest bg-white text-black uppercase shrink-0 font-mono shadow-sm"
                >
                  SEND EMAIL NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#e4e4e7] bg-[#fafafa]">
          <button
            onClick={handleSaveUser}
            className="w-full bg-black hover:bg-zinc-800 text-white font-extrabold text-xs tracking-[0.25em] py-3.5 transition-all uppercase shadow-md"
          >
            COMMIT SUBSCRIBER CARD
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
