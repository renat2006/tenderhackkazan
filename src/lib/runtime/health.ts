const bootTimestamp = Date.now();

export type HealthStatus = "ok" | "degraded" | "down";

export interface HealthSnapshot {
  status: HealthStatus;
  timestamp: string;
  uptimeSeconds: number;
  uptimeFormatted: string;
  commit: string;
  region: string;
  version: string;
  memory: {
    usedMB: number;
    totalMB: number;
    percentUsed: number;
  };
  slo: {
    uptimeTarget: string;
    latencyBudgetMs: number;
  };
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) return `${days}д ${hours}ч ${minutes}м`;
  if (hours > 0) return `${hours}ч ${minutes}м ${secs}с`;
  if (minutes > 0) return `${minutes}м ${secs}с`;
  return `${secs}с`;
}

export function getHealthSnapshot(): HealthSnapshot {
  const uptimeSeconds = Math.round((Date.now() - bootTimestamp) / 1000);
  
  // Memory info (Node.js process)
  const memUsage = process.memoryUsage();
  const usedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const totalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const percentUsed = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);

  // Determine status based on memory usage
  let status: HealthStatus = "ok";
  if (percentUsed > 90) status = "degraded";
  if (percentUsed > 95) status = "down";

  return {
    status,
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    uptimeFormatted: formatUptime(uptimeSeconds),
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GIT_COMMIT ?? "local",
    region: process.env.VERCEL_REGION ?? process.env.FLY_REGION ?? "local",
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
    memory: {
      usedMB,
      totalMB,
      percentUsed,
    },
    slo: {
      uptimeTarget: "99.95%",
      latencyBudgetMs: 400,
    },
  };
}
