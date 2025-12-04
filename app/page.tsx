"use client";

import { BankSelection } from "../components/bank-selection";
import { FileText } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-4xl md:text-5xl font-semibold text-foreground text-center mb-4 tracking-tight text-balance">
          Printing Made Simple
        </h1>
        <p className="text-muted-foreground text-center text-lg max-w-xl mx-auto mb-12 text-pretty">
          Select your bank below to begin printing cheques with precision and security. Fast, reliable, and accurate.
        </p>
      </section>

      {/* Bank Selection */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Select Your Bank</h2>
        </div>
        <BankSelection />
      </section>
    </main>
  )
}
