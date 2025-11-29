const bootTimestamp = Date.now();

export function getHealthSnapshot() {
  const uptimeSeconds = Math.round((Date.now() - bootTimestamp) / 1000);

  return {
    status: "ok" as const,
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GIT_COMMIT ?? "local",
    region: process.env.VERCEL_REGION ?? process.env.FLY_REGION ?? "local",
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
    slo: {
      uptimeTarget: "99.95%",
      latencyBudgetMs: 400,
    },
  };
}
