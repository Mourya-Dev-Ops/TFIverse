"use client";

import { useState } from "react";
import { deleteAccount } from "@/app/actions/profile";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

export default function DeleteAccountModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (confirmText !== "DELETE") return;
    setDeleting(true);

    const result = await deleteAccount();
    if (result.success) {
      await signOut({ callbackUrl: "/" });
    }
    setDeleting(false);
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-black border border-neutral-800 w-full max-w-md p-8"
          onClick={e => e.stopPropagation()}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 border border-neutral-700 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-white" size={32} />
            </div>
            <h3 className="text-lg font-bold tracking-tight mb-2">Delete Account</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              This action cannot be undone. All your data — profile, reviews, tier lists, and memes — will be permanently erased.
            </p>
          </div>

          <div className="mb-6">
            <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase mb-2 block">
              Type <span className="font-mono bg-neutral-900 px-2 py-0.5">DELETE</span> to confirm
            </label>
            <input
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="Type DELETE here..."
              className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-3 focus:outline-none focus:border-white transition-colors font-mono"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { onClose(); setConfirmText(""); }}
              className="flex-1 py-3 border border-neutral-800 text-neutral-400 hover:text-white transition-colors text-xs tracking-widest uppercase font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={confirmText !== "DELETE" || deleting}
              className="flex-1 py-3 bg-white text-black font-bold text-xs tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors"
            >
              {deleting ? "Deleting..." : "Delete Forever"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
