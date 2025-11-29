import "server-only";

import { getHealthSnapshot, type HealthSnapshot, type HealthStatus } from "@/lib/runtime/health";

export type DerivedMetric = {
  label: string;
  value: string;
  description: string;
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
      value: health.status === "ok" ? "✓ Работает" : health.status === "degraded" ? "⚠ Деградация" : "✗ Недоступен",
      description: getStatusMessage(health.status),
    },
    {
      label: "Аптайм",
      value: health.uptimeFormatted,
      description: `Сервер работает ${health.uptimeSeconds} секунд`,
    },
    {
      label: "Память",
      value: `${health.memory.usedMB}/${health.memory.totalMB} MB`,
      description: `Использовано ${health.memory.percentUsed}% heap памяти`,
    },
    {
      label: "Версия",
      value: health.version,
      description: `Коммит: ${health.commit.slice(0, 7)}`,
    },
  ];

  const monitoring: MonitoringComponent[] = [
    {
      id: "next-server",
      name: "Next.js Server",
      status: mapHealthToComponentStatus(health.status),
      description: `Region: ${health.region}`,
    },
    {
      id: "api-health",
      name: "API Health Endpoint",
      status: "up",
      description: "/api/health",
    },
    {
      id: "memory",
      name: "Memory Usage",
      status: health.memory.percentUsed > 80 ? "degraded" : "up",
      description: `${health.memory.percentUsed}% использовано`,
    },
  ];

  // Инциденты пока пустые — можно добавить логику из внешнего источника
  const incidents: IncidentItem[] = [];

  const statusBanner: StatusBanner = {
    message: getStatusMessage(health.status),
    indicator: health.status,
    uptime: health.uptimeFormatted,
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
