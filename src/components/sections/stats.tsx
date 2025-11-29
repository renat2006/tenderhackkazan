import type { DerivedMetric } from "@/lib/services/status-feed";

type PlatformStatsSectionProps = {
  metrics: DerivedMetric[];
};

export function PlatformStatsSection({ metrics }: PlatformStatsSectionProps) {
  return (
    <section id="metrics" className="mt-12 rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-slate-900 to-slate-950 p-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Метрики надёжности
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Производительность подтверждена цифрами
          </h2>
        </div>
        <p className="text-sm text-emerald-200">
          SLA 99.95% · активные рынки EU/ME · резерв MSK & KZN
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-white/10 bg-black/20 p-5"
          >
            <p className="text-sm uppercase tracking-wide text-slate-400">
              {metric.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {metric.value}
            </p>
            <p className="mt-2 text-sm text-slate-300">{metric.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
