import { AppShell } from "@/components/layout/app-shell";
import { IncidentsSection } from "@/components/sections/incidents";
import { MonitoringSection } from "@/components/sections/monitoring";
import { PlatformStatsSection } from "@/components/sections/stats";
import { getPlatformSnapshot } from "@/lib/services/status-feed";

// Рендерим в runtime, не при билде — иначе билд зависает на fetch
export const dynamic = "force-dynamic";
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
          Данные собираются напрямую с сервера Next.js. Проверка заняла
          {" "}
          <span className="font-semibold text-white">
            {snapshot.statusBanner.latencyMs} мс
          </span>
          . Версия: {snapshot.health.version}, коммит: {snapshot.health.commit.slice(0, 7)}.
        </p>
        <p className="mt-2 text-sm text-slate-300">
          API endpoint:{" "}
          <a
            href="/api/health"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-emerald-300 underline-offset-4 hover:underline"
          >
            /api/health
          </a>
        </p>
      </section>
      <PlatformStatsSection metrics={snapshot.metrics} />
      <MonitoringSection signals={snapshot.monitoring} />
      <IncidentsSection incidents={snapshot.incidents} />
    </AppShell>
  );
}
