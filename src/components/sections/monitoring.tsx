import type { MonitoringComponent } from "@/lib/services/status-feed";

const statusColor: Record<"up" | "degraded" | "down", string> = {
	up: "bg-emerald-400/20 text-emerald-200 border-emerald-400/40",
	degraded: "bg-amber-400/20 text-amber-200 border-amber-400/40",
	down: "bg-rose-500/20 text-rose-200 border-rose-500/40",
};

const statusLabel: Record<"up" | "degraded" | "down", string> = {
	up: "Online",
	degraded: "Degraded",
	down: "Offline",
};

type MonitoringSectionProps = {
	signals: MonitoringComponent[];
};

export function MonitoringSection({ signals }: MonitoringSectionProps) {
	return (
		<section
			id="monitoring"
			className="mt-12 rounded-3xl border border-white/10 bg-slate-900/70 p-8"
		>
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.3em] text-slate-400">
						Мониторинг
					</p>
					<h2 className="text-3xl font-semibold text-white">
						Нагрузка, задержки и инциденты в реальном времени
					</h2>
				</div>
				<span className="text-sm text-slate-400">
					Данные обновляются каждые 60 секунд
				</span>
			</div>
			<div className="mt-6 grid gap-4 md:grid-cols-3">
				{signals.map((signal) => (
					<article
						key={signal.id}
						className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
									Компонент
								</p>
								<p className="text-xl font-semibold text-white">
									{signal.name}
								</p>
							</div>
							<span
								className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusColor[signal.status]}`}
							>
								{statusLabel[signal.status]}
							</span>
						</div>
						<p className="mt-4 text-sm text-slate-300">
							{signal.description ?? "—"}
						</p>
					</article>
				))}
			</div>
		</section>
	);
}
