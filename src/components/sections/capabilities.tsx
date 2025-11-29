import { siteConfig } from "@/lib/config/site";

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="mt-12 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Возможности
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Все процессы поставщика под одной крышей
          </h2>
        </div>
        <span className="text-sm text-slate-400">SLA 400 мс на каждый шаг</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {siteConfig.capabilities.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/30"
          >
            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
            <p className="mt-3 text-sm text-slate-400">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
