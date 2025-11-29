import "server-only";

import { getHealthSnapshot, type HealthSnapshot, type HealthStatus } from "@/lib/runtime/health";

export type DerivedMetric = {
  label: string;
  value: string;
  description: string;
  status?: "ok" | "warning" | "critical";
};

export type MonitoringComponent = {
  id: string;
  name: string;
  status: "up" | "degraded" | "down";
  description?: string | null;
};

export type IncidentItem = {
  id: string;
  name: string;
  impact: string;
  status: string;
  lastUpdate?: string;
  url?: string | null;
};

export type StatusBanner = {
  message: string;
  indicator: HealthStatus;
  uptime: string;
  updatedAt: string;
  latencyMs: number;
};

export type PlatformSnapshot = {
  health: HealthSnapshot;
  metrics: DerivedMetric[];
  monitoring: MonitoringComponent[];
  incidents: IncidentItem[];
  statusBanner: StatusBanner;
};

function getStatusMessage(status: HealthStatus): string {
  switch (status) {
    case "ok":
      return "Все системы работают нормально";
    case "degraded":
      return "Частичная деградация производительности";
    case "down":
      return "Критические проблемы с системой";
  }
}

function mapHealthToComponentStatus(status: HealthStatus): "up" | "degraded" | "down" {
  return status === "ok" ? "up" : status;
}

export async function getPlatformSnapshot(): Promise<PlatformSnapshot> {
  const startTime = Date.now();
  const health = getHealthSnapshot();
  const latencyMs = Date.now() - startTime;

  const metrics: DerivedMetric[] = [
    {
      label: "Статус",
      value: health.status === "ok" ? "✓ Operational" : health.status === "degraded" ? "⚠ Degraded" : "✗ Down",
      description: getStatusMessage(health.status),
      status: health.status === "ok" ? "ok" : health.status === "degraded" ? "warning" : "critical",
    },
    {
      label: "Аптайм",
      value: health.uptime.formatted,
      description: `Запущен ${new Date(Date.now() - health.uptime.seconds * 1000).toLocaleString("ru-RU")}`,
      status: "ok",
    },
    {
      label: "CPU",
      value: `${health.system.cpuUsagePercent}%`,
      description: `${health.system.platform}/${health.system.arch}`,
      status: health.system.cpuUsagePercent > 80 ? "warning" : health.system.cpuUsagePercent > 95 ? "critical" : "ok",
    },
    {
      label: "Memory (RSS)",
      value: `${health.memory.rss} MB`,
      description: `Heap: ${health.memory.heapUsed}/${health.memory.heapTotal} MB (${health.memory.percentUsed}%)`,
      status: health.memory.percentUsed > 85 ? "warning" : "ok",
    },
    {
      label: "Event Loop",
      value: `${health.performance.eventLoopLagMs} ms`,
      description: `Handles: ${health.performance.activeHandles}, Requests: ${health.performance.activeRequests}`,
      status: health.performance.eventLoopLagMs > 50 ? "warning" : health.performance.eventLoopLagMs > 100 ? "critical" : "ok",
    },
    {
      label: "Версия",
      value: `v${health.build.version}`,
      description: `${health.build.commit.slice(0, 7)} • Node ${health.build.nodeVersion}`,
      status: "ok",
    },
  ];

  const monitoring: MonitoringComponent[] = [
    {
      id: "next-server",
      name: "Next.js Server",
      status: mapHealthToComponentStatus(health.status),
      description: `${health.build.environment} • ${health.system.platform}`,
    },
    {
      id: "api-health",
      name: "API Health Endpoint",
      status: "up",
      description: `Response: ${latencyMs}ms`,
    },
    {
      id: "event-loop",
      name: "Event Loop",
      status: health.performance.eventLoopLagMs > 100 ? "degraded" : "up",
      description: `Lag: ${health.performance.eventLoopLagMs}ms`,
    },
    {
      id: "memory",
      name: "Memory",
      status: health.memory.percentUsed > 90 ? "degraded" : "up",
      description: `RSS: ${health.memory.rss} MB`,
    },
    {
      id: "cpu",
      name: "CPU",
      status: health.system.cpuUsagePercent > 90 ? "degraded" : "up",
      description: `Usage: ${health.system.cpuUsagePercent}%`,
    },
  ];

  const incidents: IncidentItem[] = [];

  const statusBanner: StatusBanner = {
    message: getStatusMessage(health.status),
    indicator: health.status,
    uptime: health.uptime.formatted,
    updatedAt: health.timestamp,
    latencyMs,
  };

  return {
    health,
    metrics,
    monitoring,
    incidents,
    statusBanner,
  };
}
