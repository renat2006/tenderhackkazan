import type { IncidentItem } from "@/lib/services/status-feed";

const impactColors: Record<string, string> = {
  none: "bg-slate-800 text-slate-200",
  minor: "bg-emerald-400/20 text-emerald-200",
  major: "bg-amber-400/20 text-amber-200",
  critical: "bg-rose-500/20 text-rose-100",
};

type IncidentsSectionProps = {
  incidents: IncidentItem[];
};

export function IncidentsSection({ incidents }: IncidentsSectionProps) {
  const hasIncidents = incidents.length > 0;

  return (
    <section
      id="incidents"
      className="mt-12 rounded-3xl border border-white/10 bg-slate-950/70 p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Инциденты
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Хронология последних событий
          </h2>
        </div>
        <a
          href="/api/health"
          className="text-sm font-semibold text-emerald-300 underline-offset-4 hover:underline"
        >
          API Health →
        </a>
      </div>
      {hasIncidents ? (
        <div className="mt-6 space-y-4">
          {incidents.map((incident) => {
            const badgeClass =
              impactColors[incident.impact] ?? impactColors.none;
            return (
              <article
                key={incident.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                      {incident.status}
                    </p>
                    <h3 className="text-xl font-semibold text-white">
                      {incident.name}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                  >
                    Impact: {incident.impact}
                  </span>
                </div>
                {incident.lastUpdate ? (
                  <p className="mt-3 text-sm text-slate-300">
                    {incident.lastUpdate}
                  </p>
                ) : null}
                {incident.url ? (
                  <a
                    href={incident.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center text-sm font-semibold text-emerald-300 underline-offset-4 hover:underline"
                  >
                    Читать обновления
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-sm text-emerald-200">
          Активных инцидентов нет. Все подсистемы работают штатно.
        </p>
      )}
    </section>
  );
}
