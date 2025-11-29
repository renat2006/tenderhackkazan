import { siteConfig } from "@/lib/config/site";

export function ValuePropsSection() {
  return (
    <section id="value" className="mt-12 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Архитектурные принципы
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Почему сборка остаётся лёгкой
          </h2>
        </div>
        <span className="text-sm text-slate-400">~20 файлов в ядре</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {siteConfig.valueProps.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
          >
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
