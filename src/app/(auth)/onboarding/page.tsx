"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { Loader2, Calendar } from "lucide-react";
import { completeOnboarding } from "./actions";

export default function OnboardingPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    setError("");
    
    const dobValue = formData.get("dateOfBirth") as string;
    if (!dobValue) {
      setError("Please enter your date of birth.");
      return;
    }

    // Client-side validation
    const dobDate = new Date(dobValue);
    const today = new Date();
    if (isNaN(dobDate.getTime())) {
      setError("Invalid date format.");
      return;
    }
    if (dobDate >= today) {
      setError("Date of Birth can't be in the future.");
      return;
    }
    if (today.getFullYear() - dobDate.getFullYear() < 5) {
      setError("You must be at least 5 years old.");
      return;
    }

    try {
      const result = await completeOnboarding(formData);
      
      if (result?.success) {
        // Sign out and redirect to login — the next login will pick up the new DOB
        // This is the most reliable way to refresh the JWT
        await signOut({ redirectTo: "/login?onboarded=true" });
      }
    } catch (err: any) {
      setError(err.message || "Failed to save. Try again.");
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-black to-black pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="p-8 md:p-10 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-3xl shadow-2xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">Complete Profile</h1>
            <p className="text-xs text-neutral-400 font-bold tracking-widest uppercase">
              We need your date of birth to continue.
            </p>
          </div>

          <form
            action={(formData) => startTransition(() => handleAction(formData))}
            className="space-y-6"
          >
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-wide text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="dob-input" className="text-[10px] font-black uppercase tracking-widest text-neutral-500 pl-2">Date of Birth</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-purple-400 transition-colors pointer-events-none" />
                <input
                  id="dob-input"
                  type="date"
                  name="dateOfBirth"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
                />
              </div>
              <p className="text-[10px] text-neutral-600 pl-2">Must be a valid past date</p>
            </div>

            <button 
              type="submit"
              disabled={isPending}
              className="w-full py-4 mt-8 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-neutral-200 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isPending ? "Processing..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
