import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/lib/config/site";
import { toRouteHref } from "@/lib/utils/href";

import type { PlatformSnapshot } from "@/lib/services/status-feed";

import { StatusBar } from "./status-bar";

type AppShellProps = {
  children: ReactNode;
  statusBanner: PlatformSnapshot["statusBanner"];
};

export function AppShell({ children, statusBanner }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-16">
        <StatusBar banner={statusBanner} />
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {siteConfig.shortName}
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-200 md:justify-center">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={toRouteHref(item.href)}
                className="transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href={toRouteHref("/#contact")}
            className="inline-flex items-center rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            Связаться
          </Link>
        </header>
        <main className="flex-1 py-10 sm:py-16">{children}</main>
        <footer className="border-t border-white/10 pt-6 text-sm text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. Сборка готова к
            standalone деплою.
          </p>
        </footer>
      </div>
    </div>
  );
}
