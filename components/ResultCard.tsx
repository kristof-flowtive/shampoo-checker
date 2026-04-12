"use client";

import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRightCircle,
} from "lucide-react";
import type { AnalysisResult } from "@/app/page";

function gradeColor(grade: string): string {
  const g = grade.replace("+", "").replace("-", "");
  switch (g) {
    case "A":
      return "text-green-700 bg-green-50 border-green-200";
    case "B":
      return "text-blue-700 bg-blue-50 border-blue-200";
    case "C":
      return "text-yellow-700 bg-yellow-50 border-yellow-200";
    case "D":
      return "text-orange-700 bg-orange-50 border-orange-200";
    case "F":
      return "text-red-700 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

function scoreColor(score: number): string {
  if (score >= 8) return "text-green-700";
  if (score >= 6) return "text-yellow-700";
  if (score >= 4) return "text-orange-700";
  return "text-red-700";
}

function verdictBg(verdict: string): string {
  const v = verdict.toLowerCase();
  if (v.includes("safe") && !v.includes("caution") && !v.includes("not"))
    return "bg-green-50 border-green-200 text-green-800";
  if (v.includes("caution"))
    return "bg-yellow-50 border-yellow-200 text-yellow-800";
  return "bg-red-50 border-red-200 text-red-800";
}

export default function ResultCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-6">
      {/* Score Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#121212]/5 p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Grade Badge */}
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center ${gradeColor(result.grade)}`}
          >
            <span className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-serif)]">
              {result.grade}
            </span>
            <span className="text-[10px] font-medium tracking-[0.15em] uppercase opacity-60">
              Grade
            </span>
          </div>

          {/* Score + Info */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-medium text-[#121212] font-[family-name:var(--font-serif)]">
              {result.productName}
            </h3>
            {result.brand && (
              <p className="text-sm text-[#121212]/40 mb-2">{result.brand}</p>
            )}
            <div className="flex items-baseline gap-1.5 justify-center sm:justify-start mb-3">
              <span
                className={`text-3xl font-light font-[family-name:var(--font-serif)] ${scoreColor(result.score)}`}
              >
                {result.score}
              </span>
              <span className="text-[#121212]/25 text-sm">/ 10</span>
            </div>
            <div
              className={`inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border ${verdictBg(result.verdict)}`}
            >
              {result.verdict}
            </div>
          </div>

          {/* Score Bar */}
          <div className="w-full sm:w-32">
            <div className="h-2 bg-[#121212]/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${result.score * 10}%`,
                  background:
                    result.score >= 7
                      ? "linear-gradient(90deg, #22c55e, #16a34a)"
                      : result.score >= 5
                        ? "linear-gradient(90deg, #eab308, #f59e0b)"
                        : "linear-gradient(90deg, #ef4444, #dc2626)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <p className="mt-6 text-[#121212]/55 text-sm leading-relaxed border-t border-[#121212]/5 pt-5">
          {result.summary}
        </p>
      </div>

      {/* Good Ingredients */}
      {result.goodIngredients.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#121212]/5 p-5 sm:p-7">
          <h4 className="font-medium text-[#121212] mb-4 flex items-center gap-2.5 text-sm tracking-wide">
            <CheckCircle size={17} className="text-green-500" />
            Extension-Friendly Ingredients
          </h4>
          <div className="space-y-2">
            {result.goodIngredients.map((ing, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-1 sm:gap-3 p-3 sm:p-3.5 bg-green-50/50 rounded-xl"
              >
                <span className="font-medium text-green-800 text-sm">
                  {ing.name}
                </span>
                <span className="text-[#121212]/50 text-sm">{ing.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bad Ingredients */}
      {result.badIngredients.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#121212]/5 p-5 sm:p-7">
          <h4 className="font-medium text-[#121212] mb-4 flex items-center gap-2.5 text-sm tracking-wide">
            <XCircle size={17} className="text-red-500" />
            Potentially Harmful Ingredients
          </h4>
          <div className="space-y-2">
            {result.badIngredients.map((ing, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-1 sm:gap-3 p-3 sm:p-3.5 bg-red-50/50 rounded-xl">
                <span className="font-medium text-red-800 text-sm">
                  {ing.name}
                </span>
                <span className="text-[#121212]/50 text-sm">{ing.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="bg-yellow-50/70 rounded-2xl border border-yellow-200 p-5 sm:p-7">
          <h4 className="font-medium text-yellow-800 mb-3 flex items-center gap-2.5 text-sm tracking-wide">
            <AlertTriangle size={17} />
            Warnings
          </h4>
          <ul className="space-y-1.5">
            {result.warnings.map((w, i) => (
              <li key={i} className="text-yellow-700 text-sm leading-relaxed">
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips */}
      {result.tips.length > 0 && (
        <div className="bg-[#e6f4f4]/60 rounded-2xl border border-[#bfe2e3] p-5 sm:p-7">
          <h4 className="font-medium text-[#0a5a62] mb-3 flex items-center gap-2.5 text-sm tracking-wide">
            <Lightbulb size={17} />
            Tips
          </h4>
          <ul className="space-y-1.5">
            {result.tips.map((t, i) => (
              <li key={i} className="text-[#0e7c86] text-sm leading-relaxed">
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      {result.recommendation && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-5 sm:p-7">
          <h4 className="font-medium text-emerald-900 mb-4 flex items-center gap-2.5 text-sm tracking-wide">
            <ArrowRightCircle size={17} className="text-emerald-600" />
            Try This Instead
          </h4>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {result.recommendation.imageUrl && (
              <div className="w-24 h-24 rounded-xl border border-emerald-200 bg-white overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/image-proxy?url=${encodeURIComponent(result.recommendation.imageUrl)}`}
                  alt={result.recommendation.productName}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <div
              className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center shrink-0 ${gradeColor(result.recommendation.grade)}`}
            >
              <span className="text-xl font-bold font-[family-name:var(--font-serif)]">
                {result.recommendation.grade}
              </span>
              <span className="text-[10px] font-medium opacity-60">
                {result.recommendation.score}/10
              </span>
            </div>
            <div>
              <p className="font-medium text-emerald-900 font-[family-name:var(--font-serif)]">
                {result.recommendation.productName}
              </p>
              <p className="text-sm text-emerald-700/70 mb-1">
                {result.recommendation.brand}
              </p>
              <p className="text-sm text-[#121212]/50">
                {result.recommendation.reason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-[#121212]/25 text-center px-4 tracking-wide">
        This analysis is AI-generated and for informational purposes only. Actual
        product formulations may vary. Always consult your hair extension stylist
        for personalized recommendations.
      </p>
    </div>
  );
}
