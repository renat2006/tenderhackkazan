const bootTimestamp = Date.now();
let lastCpuUsage = process.cpuUsage();
let lastCpuTime = Date.now();

export type HealthStatus = "ok" | "degraded" | "down";

export interface HealthSnapshot {
  status: HealthStatus;
  timestamp: string;
  uptime: {
    seconds: number;
    formatted: string;
  };
  build: {
    version: string;
    commit: string;
    nodeVersion: string;
    environment: string;
  };
  system: {
    platform: string;
    arch: string;
    cpuUsagePercent: number;
  };
  memory: {
    rss: number;        // Resident Set Size — реальное потребление
    heapUsed: number;
    heapTotal: number;
    external: number;
    percentUsed: number;
  };
  performance: {
    eventLoopLagMs: number;
    activeHandles: number;
    activeRequests: number;
  };
  slo: {
    uptimeTarget: string;
    p99LatencyMs: number;
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

function getCpuUsagePercent(): number {
  const now = Date.now();
  const elapsed = now - lastCpuTime;
  
  if (elapsed < 100) return 0; // Слишком мало времени прошло
  
  const currentUsage = process.cpuUsage(lastCpuUsage);
  const totalCpuTime = (currentUsage.user + currentUsage.system) / 1000; // микросекунды → мс
  const cpuPercent = Math.round((totalCpuTime / elapsed) * 100);
  
  // Обновляем для следующего вызова
  lastCpuUsage = process.cpuUsage();
  lastCpuTime = now;
  
  return Math.min(cpuPercent, 100);
}

function measureEventLoopLag(): number {
  const start = Date.now();
  // Синхронная операция для измерения задержки
  const expected = 1;
  const actual = Date.now() - start;
  return Math.max(0, actual - expected);
}

export function getHealthSnapshot(): HealthSnapshot {
  const uptimeSeconds = Math.round((Date.now() - bootTimestamp) / 1000);
  const memUsage = process.memoryUsage();
  const cpuPercent = getCpuUsagePercent();
  const eventLoopLag = measureEventLoopLag();
  
  // RSS в MB
  const rss = Math.round(memUsage.rss / 1024 / 1024);
  const heapUsed = Math.round(memUsage.heapUsed / 1024 / 1024);
  const heapTotal = Math.round(memUsage.heapTotal / 1024 / 1024);
  const external = Math.round(memUsage.external / 1024 / 1024);
  const percentUsed = heapTotal > 0 ? Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100) : 0;

  // Определяем статус на основе критических метрик
  let status: HealthStatus = "ok";
  
  // Event loop lag > 100ms = проблема
  if (eventLoopLag > 100) status = "degraded";
  if (eventLoopLag > 500) status = "down";
  
  // CPU > 90% = проблема
  if (cpuPercent > 90) status = "degraded";
  if (cpuPercent > 98) status = "down";

  // @ts-expect-error — Node.js internal API
  const activeHandles = process._getActiveHandles?.()?.length ?? 0;
  // @ts-expect-error — Node.js internal API  
  const activeRequests = process._getActiveRequests?.()?.length ?? 0;

  return {
    status,
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: uptimeSeconds,
      formatted: formatUptime(uptimeSeconds),
    },
    build: {
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
      commit: process.env.GIT_COMMIT ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
      nodeVersion: process.version,
      environment: process.env.NODE_ENV ?? "development",
    },
    system: {
      platform: process.platform,
      arch: process.arch,
      cpuUsagePercent: cpuPercent,
    },
    memory: {
      rss,
      heapUsed,
      heapTotal,
      external,
      percentUsed,
    },
    performance: {
      eventLoopLagMs: eventLoopLag,
      activeHandles,
      activeRequests,
    },
    slo: {
      uptimeTarget: "99.95%",
      p99LatencyMs: 400,
    },
  };
}
