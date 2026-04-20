"use client";

import { useMemo, useState } from "react";
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
      return "text-[#0a5a62] bg-[#e4f3f4] border-[#b1e4e3]";
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
  // De-duplicate recommendations by product + brand so we never show the same one twice
  const uniqueRecs = useMemo(() => {
    const seen = new Set<string>();
    const out: AnalysisResult["recommendations"] = [];
    for (const rec of result.recommendations ?? []) {
      const key = `${(rec.brand ?? "").toLowerCase().trim()}::${(rec.productName ?? "").toLowerCase().trim()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(rec);
    }
    return out;
  }, [result.recommendations]);

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#121212]/5 p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center ${gradeColor(result.grade)}`}
          >
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {result.grade}
            </span>
            <span className="text-[10px] font-medium tracking-[0.15em] uppercase opacity-60">
              Grade
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-medium text-[#121212] tracking-tight">
              {result.productName}
            </h3>
            {result.brand && (
              <p className="text-sm text-[#121212]/40 mb-2">{result.brand}</p>
            )}
            <div className="flex items-baseline gap-1.5 justify-center sm:justify-start mb-3">
              <span
                className={`text-3xl font-light tracking-tight ${scoreColor(result.score)}`}
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

        <p className="mt-6 text-[#121212]/55 text-sm leading-relaxed border-t border-[#121212]/5 pt-5">
          {result.summary}
        </p>
      </div>

      {/* Good Ingredients */}
      {result.goodIngredients.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#121212]/5 p-5 sm:p-7">
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
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#121212]/5 p-5 sm:p-7">
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
        <div className="bg-yellow-50/80 backdrop-blur-sm rounded-2xl border border-yellow-200 p-5 sm:p-7">
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
        <div className="bg-[#e4f3f4]/80 backdrop-blur-sm rounded-2xl border border-[#b1e4e3] p-5 sm:p-7">
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

      {/* Recommendations — all options shown at once */}
      {uniqueRecs.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#b1e4e3] p-5 sm:p-7 shadow-sm">
          <h4 className="font-medium text-[#0a5a62] flex items-center gap-2.5 text-sm tracking-wide mb-5">
            <ArrowRightCircle size={17} className="text-[#0e7c86]" />
            Recommended Alternatives
          </h4>
          <div className="space-y-4">
            {uniqueRecs.map((rec, i) => (
              <RecommendationTile key={`${rec.brand}-${rec.productName}-${i}`} rec={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-[#121212]/35 text-center px-4 tracking-wide">
        This analysis is AI-generated and for informational purposes only. Actual
        product formulations may vary. Always consult your hair extension stylist
        for personalized recommendations.
      </p>
    </div>
  );
}

type Rec = NonNullable<AnalysisResult["recommendations"]>[number];

function RecommendationTile({ rec }: { rec: Rec }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = !!rec.imageUrl && !imgFailed;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 p-4 rounded-xl bg-[#f2fafa] border border-[#b1e4e3]/60 animate-fade-in">
      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg border border-[#b1e4e3] bg-white overflow-hidden shrink-0 flex items-center justify-center p-0.5">
        {hasImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`/api/image-proxy?url=${encodeURIComponent(rec.imageUrl as string)}`}
            alt={rec.productName}
            className="w-full h-full object-contain"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full rounded-md bg-gradient-to-br from-[#e4f3f4] to-[#b1e4e3] flex items-center justify-center text-[#0a5a62] text-[10px] font-medium tracking-wider uppercase">
            No image
          </div>
        )}
      </div>
      <div
        className={`w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center shrink-0 ${gradeColor(rec.grade)}`}
      >
        <span className="text-lg font-semibold tracking-tight">{rec.grade}</span>
        <span className="text-[9px] font-medium opacity-60">
          {rec.score}/10
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#121212] tracking-tight">
          {rec.productName}
        </p>
        <p className="text-sm text-[#0e7c86]/80 mb-1">{rec.brand}</p>
        <p className="text-sm text-[#121212]/55 leading-relaxed">
          {rec.reason}
        </p>
      </div>
    </div>
  );
}
