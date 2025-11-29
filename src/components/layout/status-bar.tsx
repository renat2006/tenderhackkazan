import type { PlatformSnapshot } from "@/lib/services/status-feed";

type StatusBarProps = {
  banner: PlatformSnapshot["statusBanner"];
};

const indicatorStyles: Record<string, string> = {
  none: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
  minor: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  major: "border-orange-400/30 bg-orange-400/10 text-orange-100",
  critical: "border-rose-500/30 bg-rose-500/10 text-rose-100",
};

export function StatusBar({ banner }: StatusBarProps) {
  const indicatorClass = indicatorStyles[banner.indicator] ?? indicatorStyles.none;
  const updatedAt = new Date(banner.updatedAt).toLocaleString("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div
      className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${indicatorClass}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-semibold text-white">{banner.message}</span>
        <span>Аптайм 30д: {banner.uptime30d}</span>
        <span>Обновлено: {updatedAt}</span>
        <span>Latency feed: {banner.latencyMs} мс</span>
      </div>
    </div>
  );
}
