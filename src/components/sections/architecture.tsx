const layers = [
  {
    title: "Маршрутизация",
    description:
      "App Router использует группу (marketing) для публичной витрины и готов к добавлению `(suppliers)` / `(buyers)` сегментов без ломки основного дерева.",
  },
  {
    title: "Каркас",
    description:
      "`AppShell` + `StatusBar` формируют единый layout и читают живую сводку из `getPlatformSnapshot()`, поэтому статус-лента совпадает на всех страницах.",
  },
  {
    title: "Конфигурация",
    description:
      "`siteConfig` держит навигацию и копирайт, а `lib/services/status-feed.ts` обеспечивает реальные метрики — никаких моков в UI.",
  },
  {
    title: "Данные",
    description:
      "SSR по умолчанию, `revalidate = 3600` и явные настройки кеша. Любые внешние fetch-и получают строгие политики (`cache`, `revalidate`).",
  },
  {
    title: "API",
    description:
      "`/api/health` возвращает uptime, commit, регион и целевые SLO — удобно для внешних мониторингов и k8s prob.",
  },
  {
    title: "Деплой",
    description:
      "`next.config.ts` выдаёт standalone build, включает сжатие, HTTP Keep-Alive, оптимизацию изображений и security headers + CSP из middleware.",
  },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="mt-12 rounded-3xl border border-white/10 bg-slate-900/70 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Архитектура
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Архитектура для сделок на миллионы
          </h2>
        </div>
        <span className="text-sm text-slate-400">6 слоёв</span>
      </div>
      <div className="mt-6 space-y-4">
        {layers.map((layer, index) => (
          <article
            key={layer.title}
            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/50 p-5 sm:flex-row sm:items-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-base font-semibold text-emerald-200">
              {index + 1}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{layer.title}</h3>
              <p className="text-sm text-slate-300">{layer.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
