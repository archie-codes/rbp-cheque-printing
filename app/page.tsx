"use client";

import React, { useRef, useState } from "react";
import { Printer, RotateCcw, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PromissoryNoteFiller() {
  const [showTemplate, setShowTemplate] = useState(true);
  const [formData, setFormData] = useState<Record<string, string>>({
    month1: "",
    month2: "",
    day1: "",
    day2: "",
    year1: "",
    year2: "",
    year3: "",
    year4: "",
    name: "",
    pesos: "",
    pesosSentece: "",
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    const emptyData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {} as Record<string, string>);
    setFormData(emptyData);
  };

  // function formatNumber(value: string) {
  //   // keep only digits and dot, then format integer part with commas and preserve up to 2 decimals
  //   const cleaned = value.replace(/[^\d.]/g, "");
  //   if (!cleaned) return "";
  //   const [intPart = "0", decPart] = cleaned.split(".");
  //   const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //   const decimal = decPart ? "." + decPart.slice(0, 2) : "";
  //   return intFormatted + decimal;
  // }
  function formatNumberOnBlur(value: string) {
    const cleaned = (value ?? "").replace(/[^\d.]/g, "");

    // If empty → always return default
    if (!cleaned) return "00,000.00";

    const [rawInt = "0", rawDec = ""] = cleaned.split(".");

    // Ensure at least 5 digits → pad left with zeros → 00,000
    const paddedInt = rawInt.padStart(4, "0");

    // Add commas
    const intWithCommas = paddedInt.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Decimals → always 2
    const decimal = "." + (rawDec + "00").slice(0, 2);

    return intWithCommas + decimal;
  }

  // Convert number to words in sentence format
  function numberToWordsSentence(value: string) {
    const cleaned = value.replace(/[^\d.]/g, "");
    if (!cleaned) return "";

    const num = parseFloat(cleaned);
    if (isNaN(num)) return "";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const toWords = (n: number): string => {
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100)
        return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
      if (n < 1000)
        return (
          ones[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + toWords(n % 100) : "")
        );
      if (n < 1000000)
        return (
          toWords(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + toWords(n % 1000) : "")
        );
      return "";
    };

    const [intPart, decPart = ""] = cleaned.split(".");
    const pesos = parseInt(intPart, 10);
    const centavos = decPart.substring(0, 2).padEnd(2, "0");

    const words = toWords(pesos);

    // ✅ If no centavos or only zeros
    if (parseInt(centavos) === 0) {
      return `${words} Pesos Only`;
    }

    return `${words} Pesos and ${centavos}/100 Centavos Only`;
  }

// Refs for auto-focus
  const refs = {
  month1: useRef<HTMLInputElement>(null),
  month2: useRef<HTMLInputElement>(null),
  day1: useRef<HTMLInputElement>(null),
  day2: useRef<HTMLInputElement>(null),
  year1: useRef<HTMLInputElement>(null),
  year2: useRef<HTMLInputElement>(null),
  year3: useRef<HTMLInputElement>(null),
  year4: useRef<HTMLInputElement>(null),
};

const handleDigit = (
  e: React.ChangeEvent<HTMLInputElement>,
  field: keyof typeof formData,
  next?: React.RefObject<HTMLInputElement | null>
) => {
  const value = e.target.value.replace(/\D/g, "").slice(0, 1); // numbers only, 1 digit
  updateField(field, value);

  if (value && next?.current) {
    next.current.focus();
  }
};


  return (
    <div className=" bg-gray-100">
      {/* Controls */}
      <div className="print:hidden bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3">
          <Button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-green-700"
          >
            <Printer size={18} />
            Print
          </Button>
          <Button
            onClick={resetForm}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            <RotateCcw size={18} />
            Reset
          </Button>
          <Button
            onClick={() => setShowTemplate(!showTemplate)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showTemplate ? <EyeOff size={18} /> : <Eye size={18} />}
            {showTemplate ? "Hide" : "Show"} Template
          </Button>
        </div>
      </div>

      {/* Cheque Size Paper (202mm × 72mm) */}
      <div className="flex justify-center p-8 print:p-0 print:flex print:justify-start print:absolute print:top-0 print:left-0">
        <div
          className="bg-white shadow-lg relative print:shadow-none"
          id="cheque-container"
          style={{
            width: "205mm",
            height: "76mm",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* Background Template Image - Hidden when printing */}
          {showTemplate && (
            <div
              className="absolute inset-0 print:hidden pointer-events-none"
              style={{ width: "205mm", height: "76mm" }}
            >
              <Image
                src="/template/bdo_cheque_scan.jpg"
                alt="Template Background"
                width={775} // 76mm × 96 DPI / 25.4mm per inch
                height={287} // 205mm × 96 DPI / 25.4mm per inch
                className="w-full h-full opacity-50 relative"
                style={{ objectFit: "fill" }}
              />
            </div>
          )}

          {/* Fillable Fields - Positioned exactly over template underlines */}
          {/* Scaled from letter size: 11in×8.5in to cheque size: 72mm×202mm */}
          {/* Padding scaled: 0.4in(10.16mm) × 0.9365 = 9.52mm, 0.5in(12.7mm) × 0.2576 = 3.27mm */}
          <div className="relative" style={{ padding: "9.52mm 3.27mm" }}>
            {/* Top right date: __ __, __ __, __ __ __ __ */}
            {/* Position scaled: top 309px/816px = 0.3787 → 76.5mm, right 313px/1056px = 0.2964 → 21.3mm */}
            <div className="absolute" style={{ top: "12.5mm", right: "12mm" }}>
              <div className="flex items-baseline gap-0">
  {/* Month */}
  <input
    ref={refs.month1}
    value={formData.month1}
    inputMode="numeric"
    maxLength={1}
    pattern="[0-9]*"
    onChange={(e) => handleDigit(e, "month1", refs.month2)}
    className="border-b border-gray-400 print:border-none text-center bg-transparent focus:outline-none"
    style={{ fontSize: "11pt", width: "4.6mm", marginRight: "0.66mm" }}
  />

  <input
    ref={refs.month2}
    value={formData.month2}
    inputMode="numeric"
    maxLength={1}
    pattern="[0-9]*"
    onChange={(e) => handleDigit(e, "month2", refs.day1)}
    className="border-b border-gray-400 print:border-none text-center bg-transparent focus:outline-none"
    style={{ fontSize: "11pt", width: "4.6mm", marginRight: "2.2mm" }}
  />

  {/* Day */}
  <input
    ref={refs.day1}
    value={formData.day1}
    inputMode="numeric"
    maxLength={1}
    pattern="[0-9]*"
    onChange={(e) => handleDigit(e, "day1", refs.day2)}
    className="border-b border-gray-400 print:border-none text-center bg-transparent focus:outline-none"
    style={{ fontSize: "11pt", width: "4.6mm", marginRight: "0.66mm" }}
  />

  <input
    ref={refs.day2}
    value={formData.day2}
    inputMode="numeric"
    maxLength={1}
    pattern="[0-9]*"
    onChange={(e) => handleDigit(e, "day2", refs.year1)}
    className="border-b border-gray-400 print:border-none text-center bg-transparent focus:outline-none"
    style={{ fontSize: "11pt", width: "4.6mm", marginRight: "2.2mm" }}
  />

  {/* Year */}
  <input
    ref={refs.year1}
    value={formData.year1}
    inputMode="numeric"
    maxLength={1}
    pattern="[0-9]*"
    onChange={(e) => handleDigit(e, "year1", refs.year2)}
    className="border-b border-gray-400 print:border-none text-center bg-transparent focus:outline-none"
    style={{ fontSize: "11pt", width: "4.6mm", marginRight: "0.66mm" }}
  />

  <input
    ref={refs.year2}
    value={formData.year2}
    inputMode="numeric"
    maxLength={1}
    pattern="[0-9]*"
    onChange={(e) => handleDigit(e, "year2", refs.year3)}
    className="border-b border-gray-400 print:border-none text-center bg-transparent focus:outline-none"
    style={{ fontSize: "11pt", width: "4.6mm", marginRight: "0.66mm" }}
  />

  <input
    ref={refs.year3}
    value={formData.year3}
    inputMode="numeric"
    maxLength={1}
    pattern="[0-9]*"
    onChange={(e) => handleDigit(e, "year3", refs.year4)}
    className="border-b border-gray-400 print:border-none text-center bg-transparent focus:outline-none"
    style={{ fontSize: "11pt", width: "4.6mm", marginRight: "0.66mm" }}
  />

  <input
    ref={refs.year4}
    value={formData.year4}
    inputMode="numeric"
    maxLength={1}
    pattern="[0-9]*"
    onChange={(e) => handleDigit(e, "year4")}
    className="border-b border-gray-400 print:border-none text-center bg-transparent focus:outline-none"
    style={{ fontSize: "11pt", width: "4.6mm", marginRight: "0.08mm" }}
  />
</div>

            </div>
            {/* Bottom left name: ___________________________ */}
            <div className="absolute" style={{ bottom: "-7mm", left: "27mm" }}>
              <div className="flex items-baseline gap-0">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500"
                  style={{ fontSize: "11pt", width: "115mm" }}
                />
              </div>
            </div>
            {/* Bottom right pesos: ___________________________ */}
            <div className="absolute" style={{ bottom: "-7mm", right: "30mm" }}>
              <div className="flex items-baseline gap-0">
                <input
                  type="text"
                  value={formData.pesos}
                  onChange={(e) => updateField("pesos", e.target.value)}
                  onBlur={(e) => {
                    const formatted = formatNumberOnBlur(e.target.value);
                    updateField("pesos", formatted);

                    // auto create sentence form
                    const sentence = numberToWordsSentence(formatted);
                    updateField("pesosSentece", sentence);
                  }}
                  className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none"
                  style={{ fontSize: "11pt", width: "30mm" }}
                />
              </div>
            </div>

            {/* Bottom left Pesos in Sentence: ___________________________ */}
            <div className="absolute" style={{ bottom: "-15mm", left: "18mm" }}>
              <div className="flex items-baseline gap-0">
                <input
                  type="text"
                  value={formData.pesosSentece}
                  onChange={(e) => updateField("pesosSentece", e.target.value)}
                  className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500"
                  style={{ fontSize: "11pt", width: "180mm" }}
                />
              </div>
            </div>
          </div>

          {/* Print styles */}
          <style>{`
            @media print {
  body { 
    margin: 0; 
    padding: 0; 
  }
  @page { 
    size: 205mm 76mm; 
    margin: 0; 
  }
  input { 
    font-family: Arial, sans-serif !important;
    color: black !important;
  }
}
          `}</style>
        </div>
      </div>
    </div>
  );
}
