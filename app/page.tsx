"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Search,
  Sparkles,
  FlaskConical,
  ShieldCheck,
  Upload,
  Camera,
  Keyboard,
  X,
  ArrowRight,
} from "lucide-react";
import ResultCard from "@/components/ResultCard";

export type AnalysisResult = {
  productName: string;
  brand: string;
  score: number;
  grade: string;
  verdict: string;
  summary: string;
  goodIngredients: { name: string; reason: string }[];
  badIngredients: { name: string; reason: string }[];
  warnings: string[];
  tips: string[];
  recommendation: {
    productName: string;
    brand: string;
    score: number;
    grade: string;
    reason: string;
    amazonAsin?: string;
    imageUrl?: string;
  } | null;
};

type InputMode = "text" | "upload" | "camera";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [mode, setMode] = useState<InputMode>("text");
  const [query, setQuery] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  function handleModeChange(next: InputMode) {
    if (next === mode) return;
    setMode(next);
    setError("");
  }

  function handleFileSelected(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image is too large. Please keep it under 5MB.");
      return;
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  }

  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (uploadInputRef.current) uploadInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  const canSubmit =
    !loading &&
    (mode === "text" ? query.trim().length > 0 : imageFile !== null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      let body: Record<string, string>;
      if (mode === "text") {
        body = { query: query.trim() };
      } else {
        if (!imageFile) {
          setError("Please choose an image first.");
          setLoading(false);
          return;
        }
        const imageBase64 = await fileToDataUrl(imageFile);
        body = { imageBase64 };
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setResult(data);
    } catch {
      setError("Failed to connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <header className="border-b border-[#121212]/5 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Image
              src="/beauvoir-logo.png"
              alt="Beauvoir"
              width={200}
              height={50}
              className="h-8 sm:h-11 w-auto"
              priority
            />
            <div className="h-5 sm:h-6 w-px bg-[#121212]/10" />
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase text-[#0e7c86]">
              Extension-Safe
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-8 sm:pt-16 pb-6 sm:pb-10">
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-[#0e7c86] mb-3 sm:mb-4">
            AI-Powered Ingredient Analysis
          </p>
          <h2 className="text-3xl sm:text-5xl font-light text-[#121212] mb-3 sm:mb-4 leading-[1.15]">
            Is your shampoo safe for
            <br />
            <span className="font-medium italic text-[#0e7c86]">
              hair extensions
            </span>
            <span className="text-[#121212]">?</span>
          </h2>
          <p className="text-[#121212]/50 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Search by name, upload a label photo, or snap a bottle.
            <br />
            We&apos;ll give you an instant compatibility grade.
          </p>
        </div>

        {/* Mode switcher */}
        <div
          role="tablist"
          aria-label="Input method"
          className="bg-white border border-[#121212]/8 rounded-full p-1 sm:p-1.5 grid grid-cols-3 gap-1 shadow-sm mb-4 sm:mb-5 max-w-sm sm:max-w-md mx-auto"
        >
          <ModeButton
            active={mode === "text"}
            onClick={() => handleModeChange("text")}
            icon={<Keyboard size={15} />}
            label="Type"
          />
          <ModeButton
            active={mode === "upload"}
            onClick={() => handleModeChange("upload")}
            icon={<Upload size={15} />}
            label="Upload"
          />
          <ModeButton
            active={mode === "camera"}
            onClick={() => handleModeChange("camera")}
            icon={<Camera size={15} />}
            label="Camera"
          />
        </div>

        <form onSubmit={handleSubmit} className="relative">
          {mode === "text" && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-[#121212]/25"
                  size={18}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='e.g. "Pantene Pro-V Daily Moisture Renewal"'
                  className="w-full pl-11 sm:pl-13 pr-4 sm:pr-5 py-3.5 sm:py-4 rounded-full border border-[#121212]/8 bg-white text-[#121212] placeholder-[#121212]/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c86]/30 focus:border-[#0e7c86] text-base sm:text-sm tracking-wide"
                  maxLength={5000}
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>
              <SubmitButton loading={loading} disabled={!canSubmit} />
            </div>
          )}

          {(mode === "upload" || mode === "camera") && (
            <div className="flex flex-col gap-3">
              <ImageDropZone
                mode={mode}
                preview={imagePreview}
                fileName={imageFile?.name ?? null}
                onPick={() => {
                  if (mode === "upload") uploadInputRef.current?.click();
                  else cameraInputRef.current?.click();
                }}
                onClear={clearImage}
              />

              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelected(e.target.files?.[0])}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFileSelected(e.target.files?.[0])}
              />

              <SubmitButton loading={loading} disabled={!canSubmit} full />
            </div>
          )}
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
            {error}
          </div>
        )}
      </section>

      {/* Results */}
      {result && (
        <section className="max-w-3xl mx-auto w-full px-4 sm:px-6 pb-12 sm:pb-20 animate-fade-in">
          <ResultCard result={result} />
        </section>
      )}

      {/* Features (shown when no result) */}
      {!result && !loading && (
        <section className="max-w-3xl mx-auto w-full px-4 sm:px-6 pb-12 sm:pb-20">
          <div className="divider-ornament text-[10px] tracking-[0.3em] uppercase text-[#121212]/25 font-medium mb-10">
            How it works
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FlaskConical size={22} />}
              title="Ingredient Analysis"
              description="AI checks every ingredient for sulfates, silicones, alcohols, and other extension-damaging compounds."
            />
            <FeatureCard
              icon={<Sparkles size={22} />}
              title="Instant Grading"
              description="Get a letter grade (A+ to F) and a score out of 10 so you know at a glance if it's safe."
            />
            <FeatureCard
              icon={<ShieldCheck size={22} />}
              title="All Extension Types"
              description="Covers clip-ins, tape-ins, sew-ins, keratin bonds, and micro-links."
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-[#121212]/5 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Image
            src="/beauvoir-logo.png"
            alt="Beauvoir"
            width={100}
            height={25}
            className="h-5 w-auto opacity-40"
          />
          <p className="text-[11px] text-[#121212]/30 tracking-wide text-center sm:text-right max-w-sm">
            Extension-Safe is for informational purposes only. Always consult
            your stylist for personalized advice.
          </p>
        </div>
      </footer>
    </main>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-2.5 px-3 rounded-full text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer select-none touch-manipulation ${
        active
          ? "bg-[#0e7c86] text-white shadow-sm"
          : "text-[#121212]/50 hover:text-[#121212] hover:bg-[#121212]/3 active:bg-[#121212]/5"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SubmitButton({
  loading,
  disabled,
  full,
}: {
  loading: boolean;
  disabled: boolean;
  full?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${
        full ? "w-full" : ""
      } group px-8 py-4 bg-[#0e7c86] text-white font-medium rounded-full shadow-md hover:shadow-lg hover:bg-[#0a5a62] active:bg-[#084a52] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer text-sm tracking-wide touch-manipulation select-none`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          Analyze
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </>
      )}
    </button>
  );
}

function ImageDropZone({
  mode,
  preview,
  fileName,
  onPick,
  onClear,
}: {
  mode: "upload" | "camera";
  preview: string | null;
  fileName: string | null;
  onPick: () => void;
  onClear: () => void;
}) {
  if (preview) {
    return (
      <div className="relative rounded-2xl border border-[#121212]/8 bg-white shadow-sm p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          alt="Selected shampoo bottle"
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#121212]/5"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#121212] truncate">
            {fileName ?? "Selected image"}
          </p>
          <button
            type="button"
            onClick={onPick}
            className="text-sm text-[#0e7c86] hover:text-[#0a5a62] active:text-[#084a52] font-medium cursor-pointer transition-colors duration-300 touch-manipulation"
          >
            Choose a different one
          </button>
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Remove image"
          className="p-2.5 rounded-full text-[#121212]/30 hover:text-[#121212]/60 hover:bg-[#121212]/5 active:bg-[#121212]/10 cursor-pointer transition-all duration-300 touch-manipulation"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  const title =
    mode === "upload" ? "Upload a label photo" : "Take a photo of the bottle";
  const subtitle =
    mode === "upload"
      ? "JPG or PNG, up to 5MB. Make sure the ingredient list is readable."
      : "Your camera will open. Frame the ingredient list clearly.";
  const Icon = mode === "upload" ? Upload : Camera;

  return (
    <button
      type="button"
      onClick={onPick}
      className="w-full rounded-2xl border-2 border-dashed border-[#121212]/10 bg-white hover:bg-[#e6f4f4]/40 hover:border-[#0e7c86]/40 active:bg-[#e6f4f4]/60 transition-all duration-300 py-8 sm:py-12 px-6 flex flex-col items-center justify-center text-center cursor-pointer group touch-manipulation select-none"
    >
      <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-[#e6f4f4] text-[#0e7c86] flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-105">
        <Icon size={22} />
      </div>
      <p className="font-medium text-[#121212] text-sm">{title}</p>
      <p className="text-xs text-[#121212]/40 mt-1.5 max-w-xs">{subtitle}</p>
    </button>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group text-center px-4">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#e6f4f4] text-[#0e7c86] mb-4 transition-all duration-300 group-hover:bg-[#0e7c86] group-hover:text-white group-hover:shadow-md">
        {icon}
      </div>
      <h3 className="font-semibold text-[#121212] mb-2 text-sm tracking-wide">
        {title}
      </h3>
      <p className="text-xs text-[#121212]/45 leading-relaxed">{description}</p>
    </div>
  );
}
