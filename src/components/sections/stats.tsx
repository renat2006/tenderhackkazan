import type { DerivedMetric } from "@/lib/services/status-feed";

const statusStyles = {
  ok: "border-emerald-400/30 bg-emerald-400/5",
  warning: "border-amber-400/30 bg-amber-400/5",
  critical: "border-rose-500/30 bg-rose-500/5",
};

const statusDot = {
  ok: "bg-emerald-400",
  warning: "bg-amber-400",
  critical: "bg-rose-500",
};

type PlatformStatsSectionProps = {
  metrics: DerivedMetric[];
};

export function PlatformStatsSection({ metrics }: PlatformStatsSectionProps) {
  return (
    <section id="metrics" className="mt-12 rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-slate-900 to-slate-950 p-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Метрики в реальном времени
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Состояние системы
          </h2>
        </div>
        <p className="text-sm text-emerald-200">
          SLA 99.95% · P99 latency &lt; 400ms
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => {
          const status = metric.status ?? "ok";
          return (
            <article
              key={metric.label}
              className={`rounded-2xl border p-5 ${statusStyles[status]}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-wide text-slate-400">
                  {metric.label}
                </p>
                <span className={`h-2 w-2 rounded-full ${statusDot[status]}`} />
              </div>
              <p className="mt-2 text-3xl font-semibold text-white">
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-slate-300">{metric.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
