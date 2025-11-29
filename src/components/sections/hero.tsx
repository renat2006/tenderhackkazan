import Link from "next/link";

import { siteConfig } from "@/lib/config/site";
import { toRouteHref } from "@/lib/utils/href";

export function HeroSection() {
  const { hero } = siteConfig;

  return (
    <section
      id="overview"
      className="flex flex-col gap-6 rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-2xl shadow-emerald-500/20 sm:p-12"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
        {hero.eyebrow}
      </p>
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          {hero.title}
        </h1>
        <p className="text-lg text-slate-200 sm:text-xl">{hero.subtitle}</p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href={toRouteHref(hero.primaryCta.href)}
          className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          {hero.primaryCta.label}
        </Link>
        <Link
          href={toRouteHref(hero.secondaryCta.href)}
          className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          {hero.secondaryCta.label}
        </Link>
      </div>
    </section>
  );
}
