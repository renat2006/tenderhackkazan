import { AppShell } from "@/components/layout/app-shell";
import { IncidentsSection } from "@/components/sections/incidents";
import { MonitoringSection } from "@/components/sections/monitoring";
import { PlatformStatsSection } from "@/components/sections/stats";
import { getPlatformSnapshot } from "@/lib/services/status-feed";

export const revalidate = 120;

export default async function StatusPage() {
  const snapshot = await getPlatformSnapshot();

  return (
    <AppShell statusBanner={snapshot.statusBanner}>
      <section className="rounded-3xl border border-emerald-400/30 bg-slate-900/70 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
          Live Status
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-white">
          Текущее состояние TenderSupply
        </h1>
        <p className="mt-4 text-sm text-slate-300">
          Данные поступают из публичного статус-фида. Обновление занимает
          {" "}
          <span className="font-semibold text-white">
            {snapshot.statusBanner.latencyMs} мс
          </span>
          , индикатор: {snapshot.statusBanner.indicator}.
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Внешняя страница: {" "}
          <a
            href={snapshot.feedUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-emerald-300 underline-offset-4 hover:underline"
          >
            {snapshot.feedUrl}
          </a>
        </p>
      </section>
      <PlatformStatsSection metrics={snapshot.metrics} />
      <MonitoringSection signals={snapshot.monitoring} />
      <IncidentsSection incidents={snapshot.incidents} feedUrl={snapshot.feedUrl} />
    </AppShell>
  );
}
