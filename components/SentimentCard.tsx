import { SentimentData } from "@/types/movie";

interface SentimentCardProps {
  sentiment: SentimentData;
}

const classificationStyles: Record<SentimentData["classification"], string> = {
  Positive: "bg-emerald-100 text-emerald-700",
  Mixed: "bg-amber-100 text-amber-700",
  Negative: "bg-rose-100 text-rose-700",
};

export default function SentimentCard({ sentiment }: SentimentCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">Audience Sentiment</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${classificationStyles[sentiment.classification]}`}
        >
          {sentiment.classification}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-700">{sentiment.summary}</p>
    </section>
  );
}
