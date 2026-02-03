"use client";

import { BankSelection } from "../components/bank-selection";
import { FileText } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full relative">
      {/* Aurora Dream Corner Whispers Background */}
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

      {/* Main Content - Added 'relative z-10' to sit above the background */}
      <main className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground text-center mb-4 tracking-tight text-balance">
            Printing Made Simple
          </h1>
          <p className="text-muted-foreground text-center text-lg max-w-xl mx-auto mb-12 text-pretty">
            Select your bank below to begin printing cheques with precision and
            security. Fast, reliable, and accurate.
          </p>
        </section>

        {/* Bank Selection */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="text-center mb-8">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Select Your Bank
            </h2>
          </div>
          <BankSelection />
        </section>
      </main>
    </div>
  );
}