"use client";

import Link from "next/link";
import { ArrowLeft, Hammer, Sparkles, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden">
      {/* 1. Aurora Background (Consistent with your theme) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),
            radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),
            radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),
            radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),
            linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
          `,
        }}
      />

      {/* 2. Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-500">
          
          {/* Animated Icon */}
          <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 relative">
            <Hammer className="w-8 h-8 text-indigo-600 animate-pulse" />
            <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white shadow-sm">
              WIP
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
            Under Maintenance
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            We are currently polishing this page to ensure perfection.
          </p>

          {/* Developer Badge / "IT - Archie" Section */}
          <div className="bg-white/60 rounded-xl p-4 mb-8 border border-white/50 flex items-center gap-4 text-left shadow-sm">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <UserCircle2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-0.5">
                Developer Assigned
              </p>
              <p className="text-sm font-medium text-slate-800 flex items-center gap-1">
                IT - Archie
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
              </p>
            </div>
          </div>

          {/* Fake Progress Bar to induce "Wait" psychology */}
          <div className="w-full bg-slate-200/50 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full w-[75%] animate-[pulse_2s_ease-in-out_infinite]"></div>
          </div>
          <p className="text-xs text-slate-400 mb-8 font-medium">
            Finishing touches in progress...
          </p>

          {/* Action Button */}
          <Link href="/">
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all rounded-xl py-6 text-base font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        {/* Footer Credit */}
        <p className="text-center text-slate-500/80 text-xs mt-6 font-medium">
          System Update • 2026 © RBP IT Team
        </p>
      </div>
    </div>
  );
}