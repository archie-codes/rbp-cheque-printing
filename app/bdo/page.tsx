"use client";

import type React from "react";
import { useRef, useState } from "react";
import {
  Printer,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowLeft,
  Calendar,
  User,
  DollarSign,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function BDOChequeFiller() {
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

  function formatNumberOnBlur(value: string) {
    const cleaned = (value ?? "").replace(/[^\d.]/g, "");
    if (!cleaned) return "0.00";

    const [rawInt = "0", rawDec = ""] = cleaned.split(".");

    // No padStart so high amounts like 10,000,000 work
    const intWithCommas = Number(rawInt).toLocaleString("en-US");

    const decimal = "." + (rawDec + "00").slice(0, 2);

    return intWithCommas + decimal;
  }

  function numberToWordsSentence(value: string) {
    const cleaned = value.replace(/[^\d.]/g, "");
    if (!cleaned) return "";
    const num = Number.parseFloat(cleaned);
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
      if (n < 1000000000)
        return (
          toWords(Math.floor(n / 1000000)) +
          " Million" +
          (n % 1000000 ? " " + toWords(n % 1000000) : "")
        );
      return "";
    };

    const [intPart, decPart = ""] = cleaned.split(".");
    const pesos = Number.parseInt(intPart, 10);
    const centavos = decPart.substring(0, 2).padEnd(2, "0");
    const words = toWords(pesos);

    if (Number.parseInt(centavos) === 0) {
      return `${words} Pesos Only`;
    }
    return `${words} Pesos and ${centavos}/100 Centavos Only`;
  }

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
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    updateField(field, value);
    if (value && next?.current) {
      // Use setTimeout to ensure the value is set before focusing
      setTimeout(() => {
        next.current?.focus();
      }, 0);
    }
  };

  const handleDateKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: keyof typeof formData,
    next?: React.RefObject<HTMLInputElement | null>
  ) => {
    // Handle Enter key - move to next field or blur if last field
    if (e.key === "Enter") {
      e.preventDefault();
      if (next?.current) {
        next.current.focus();
      } else {
        e.currentTarget.blur();
      }
      return;
    }

    // Allow navigation keys
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Tab"
    ) {
      return;
    }

    // If a digit is pressed and the field already has a value, move to next
    if (/[0-9]/.test(e.key) && formData[field] && next?.current) {
      e.preventDefault();
      updateField(field, e.key);
      setTimeout(() => {
        next.current?.focus();
      }, 0);
    }
  };

  const handlePayeeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleAmountEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const formatted = formatNumberOnBlur(formData.pesos);
      updateField("pesos", formatted);
      const sentence = numberToWordsSentence(formatted);
      updateField("pesosSentece", sentence);
      // Blur the input to show the formatted value
      e.currentTarget.blur();
    }
  };

  const dateDisplay = `${formData.month1}${formData.month2}/${formData.day1}${formData.day2}/${formData.year1}${formData.year2}${formData.year3}${formData.year4}`;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 print:bg-white">
      {/* Header */}
      <header className="print:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xs">BDO</span>
                </div>
                <div>
                  <h1 className="font-semibold text-slate-900">
                    BDO Cheque Filler
                  </h1>
                  <p className="text-xs text-slate-500">Banco de Oro</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplate(!showTemplate)}
                className="gap-2"
              >
                {showTemplate ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {showTemplate ? "Hide" : "Show"} Template
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="gap-2 bg-transparent"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              <Button
                size="sm"
                onClick={() => window.print()}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6 print:p-0">
        <div className="flex flex-col xl:flex-row gap-6 print:block">
          {/* Form Panel */}
          <div className="w-full xl:w-96 shrink-0 print:hidden">
            <Card className="sticky top-24 shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Cheque Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Section */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-slate-700">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    Date (MM/DD/YYYY)
                  </Label>
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      <Input
                        ref={refs.month1}
                        value={formData.month1}
                        inputMode="numeric"
                        maxLength={1}
                        onChange={(e) => handleDigit(e, "month1", refs.month2)}
                        onKeyDown={(e) =>
                          handleDateKeyDown(e, "month1", refs.month2)
                        }
                        className="w-9 h-10 text-center font-mono text-lg p-0"
                        placeholder="M"
                      />
                      <Input
                        ref={refs.month2}
                        value={formData.month2}
                        inputMode="numeric"
                        maxLength={1}
                        onChange={(e) => handleDigit(e, "month2", refs.day1)}
                        onKeyDown={(e) =>
                          handleDateKeyDown(e, "month2", refs.day1)
                        }
                        className="w-9 h-10 text-center font-mono text-lg p-0"
                        placeholder="M"
                      />
                    </div>
                    <span className="text-slate-300 font-bold">/</span>
                    <div className="flex gap-0.5">
                      <Input
                        ref={refs.day1}
                        value={formData.day1}
                        inputMode="numeric"
                        maxLength={1}
                        onChange={(e) => handleDigit(e, "day1", refs.day2)}
                        onKeyDown={(e) =>
                          handleDateKeyDown(e, "day1", refs.day2)
                        }
                        className="w-9 h-10 text-center font-mono text-lg p-0"
                        placeholder="D"
                      />
                      <Input
                        ref={refs.day2}
                        value={formData.day2}
                        inputMode="numeric"
                        maxLength={1}
                        onChange={(e) => handleDigit(e, "day2", refs.year1)}
                        onKeyDown={(e) =>
                          handleDateKeyDown(e, "day2", refs.year1)
                        }
                        className="w-9 h-10 text-center font-mono text-lg p-0"
                        placeholder="D"
                      />
                    </div>
                    <span className="text-slate-300 font-bold">/</span>
                    <div className="flex gap-0.5">
                      <Input
                        ref={refs.year1}
                        value={formData.year1}
                        inputMode="numeric"
                        maxLength={1}
                        onChange={(e) => handleDigit(e, "year1", refs.year2)}
                        onKeyDown={(e) =>
                          handleDateKeyDown(e, "year1", refs.year2)
                        }
                        className="w-9 h-10 text-center font-mono text-lg p-0"
                        placeholder="Y"
                      />
                      <Input
                        ref={refs.year2}
                        value={formData.year2}
                        inputMode="numeric"
                        maxLength={1}
                        onChange={(e) => handleDigit(e, "year2", refs.year3)}
                        onKeyDown={(e) =>
                          handleDateKeyDown(e, "year2", refs.year3)
                        }
                        className="w-9 h-10 text-center font-mono text-lg p-0"
                        placeholder="Y"
                      />
                      <Input
                        ref={refs.year3}
                        value={formData.year3}
                        inputMode="numeric"
                        maxLength={1}
                        onChange={(e) => handleDigit(e, "year3", refs.year4)}
                        onKeyDown={(e) =>
                          handleDateKeyDown(e, "year3", refs.year4)
                        }
                        className="w-9 h-10 text-center font-mono text-lg p-0"
                        placeholder="Y"
                      />
                      <Input
                        ref={refs.year4}
                        value={formData.year4}
                        inputMode="numeric"
                        maxLength={1}
                        onChange={(e) => handleDigit(e, "year4")}
                        onKeyDown={(e) => handleDateKeyDown(e, "year4")}
                        className="w-9 h-10 text-center font-mono text-lg p-0"
                        placeholder="Y"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payee Name */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-slate-700">
                    <User className="h-4 w-4 text-slate-400" />
                    Pay to the Order of
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    onKeyDown={handlePayeeEnter}
                    placeholder="Enter payee name"
                    className="h-10"
                  />
                </div>

                <Separator />

                {/* Amount */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-slate-700">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    Amount (PHP)
                  </Label>
                  <Input
                    value={formData.pesos}
                    onChange={(e) => updateField("pesos", e.target.value)}
                    onKeyDown={handleAmountEnter}
                    onBlur={(e) => {
                      const formatted = formatNumberOnBlur(e.target.value);
                      updateField("pesos", formatted);
                      const sentence = numberToWordsSentence(formatted);
                      updateField("pesosSentece", sentence);
                    }}
                    placeholder="0.00"
                    className="h-10 font-mono text-lg"
                  />
                  {formData.pesosSentece && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-md border">
                      {"***" + formData.pesosSentece + "***"}
                    </p>
                  )}
                </div>

                {/* Quick Summary */}
                {(formData.name || formData.pesos) && (
                  <>
                    <Separator />
                    <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                      <p className="text-xs font-medium text-blue-700">
                        Summary
                      </p>
                      {formData.name && (
                        <p className="text-sm text-blue-900">
                          <span className="text-blue-600">Payee:</span>{" "}
                          {formData.name}
                        </p>
                      )}
                      {formData.pesos && (
                        <p className="text-sm text-blue-900">
                          <span className="text-blue-600">Amount:</span> PHP{" "}
                          {formData.pesos}
                        </p>
                      )}
                      {dateDisplay.replace(/\//g, "") && (
                        <p className="text-sm text-blue-900">
                          <span className="text-blue-600">Date:</span>{" "}
                          {dateDisplay}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cheque Preview */}
          <div className="flex-1 print:w-full">
            <div className="print:hidden mb-4">
              <h2 className="text-sm font-medium text-slate-600">
                Cheque Preview
              </h2>
              <p className="text-xs text-slate-400">
                Fill in the form on the left to see your cheque
              </p>
            </div>

            <div className="flex justify-center xl:justify-start print:justify-start print:absolute print:top-0 print:left-0">
              <div
                className="bg-white shadow-xl rounded-lg overflow-hidden relative print:shadow-none print:rounded-none"
                id="cheque-container"
                style={{
                  width: "205mm",
                  height: "76mm",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {/* Background Template Image */}
                {showTemplate && (
                  <div
                    className="absolute inset-0 print:hidden pointer-events-none"
                    style={{ width: "205mm", height: "76mm" }}
                  >
                    <Image
                      src="/template/bdo_cheque_scan.jpg"
                      alt="Template Background"
                      width={775}
                      height={287}
                      className="w-full h-full opacity-50 relative"
                      style={{ objectFit: "fill" }}
                    />
                  </div>
                )}

                {/* Fillable Fields */}
                <div className="relative" style={{ padding: "9.52mm 3.27mm" }}>
                  {/* Date Fields */}
                  <div
                    className="absolute"
                    style={{ top: "11.7mm", right: "11.4mm" }}
                  >
                    <div className="flex items-baseline gap-0">
                      {[
                        {
                          ref: refs.month1,
                          field: "month1",
                          next: refs.month2,
                          mr: "0.66mm",
                        },
                        {
                          ref: refs.month2,
                          field: "month2",
                          next: refs.day1,
                          mr: "2.2mm",
                        },
                        {
                          ref: refs.day1,
                          field: "day1",
                          next: refs.day2,
                          mr: "0.66mm",
                        },
                        {
                          ref: refs.day2,
                          field: "day2",
                          next: refs.year1,
                          mr: "2.2mm",
                        },
                        {
                          ref: refs.year1,
                          field: "year1",
                          next: refs.year2,
                          mr: "0.66mm",
                        },
                        {
                          ref: refs.year2,
                          field: "year2",
                          next: refs.year3,
                          mr: "0.66mm",
                        },
                        {
                          ref: refs.year3,
                          field: "year3",
                          next: refs.year4,
                          mr: "0.66mm",
                        },
                        {
                          ref: refs.year4,
                          field: "year4",
                          next: undefined,
                          mr: "0.08mm",
                        },
                      ].map((item, i) => (
                        <input
                          key={i}
                          ref={item.ref}
                          value={formData[item.field]}
                          inputMode="numeric"
                          maxLength={1}
                          pattern="[0-9]*"
                          onChange={(e) =>
                            handleDigit(
                              e,
                              item.field as keyof typeof formData,
                              item.next
                            )
                          }
                          className="border-b border-gray-400 print:border-none text-center bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
                          style={{
                            fontSize: "11pt",
                            width: "4.6mm",
                            marginRight: item.mr,
                          }}
                          disabled
                        />
                      ))}
                    </div>
                  </div>

                  {/* Name Field */}
                  <div
                    className="absolute"
                    style={{ bottom: "-7mm", left: "27mm" }}
                  >
                    <input
                      type="text"
                      value={"***" + formData.name + "***"}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
                      style={{ fontSize: "11pt", width: "115mm" }}
                      disabled
                    />
                  </div>

                  {/* Pesos Field */}
                  <div
                    className="absolute"
                    style={{ bottom: "-7mm", right: "24.5mm" }}
                  >
                    <input
                      type="text"
                      value={formData.pesos}
                      onChange={(e) => updateField("pesos", e.target.value)}
                      onBlur={(e) => {
                        const formatted = formatNumberOnBlur(e.target.value);
                        updateField("pesos", formatted);
                        const sentence = numberToWordsSentence(formatted);
                        updateField("pesosSentece", sentence);
                      }}
                      className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
                      style={{ fontSize: "11pt", width: "30mm" }}
                      disabled
                    />
                  </div>

                  {/* Pesos in Words Field */}
                  <div
                    className="absolute"
                    style={{ bottom: "-15mm", left: "18mm" }}
                  >
                    <input
                      type="text"
                      value={"***" + formData.pesosSentece + "***"}
                      onChange={(e) =>
                        updateField("pesosSentece", e.target.value)
                      }
                      className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
                      style={{ fontSize: "11pt", width: "180mm" }}
                      disabled
                    />
                  </div>
                </div>

                {/* Print styles */}
                <style>{`
                  @media print {
                    body { margin: 0; padding: 0; }
                    @page { size: 205mm 76mm; margin: 0; }
                    input { 
                      font-family: Arial, sans-serif !important;
                      color: black !important;
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
