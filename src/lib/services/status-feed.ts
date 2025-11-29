import "server-only";

import pRetry from "p-retry";
import { z } from "zod";

const componentSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  description: z.string().nullable().optional(),
  group: z.boolean().optional(),
  group_id: z.string().nullable().optional(),
  position: z.number().optional(),
});

const incidentSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  impact: z.string(),
  shortlink: z.string().url().nullable().optional(),
  incident_updates: z
    .array(
      z.object({
        body: z.string(),
        created_at: z.string(),
        status: z.string(),
      })
    )
    .default([]),
});

const maintenanceSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  scheduled_for: z.string(),
  scheduled_until: z.string(),
});

const summarySchema = z.object({
  page: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().url(),
    updated_at: z.string(),
    time_zone: z.string(),
  }),
  status: z.object({
    description: z.string(),
    indicator: z.string(),
  }),
  components: z.array(componentSchema),
  incidents: z.array(incidentSchema),
  scheduled_maintenances: z.array(maintenanceSchema),
});

const FEED_URL =
  process.env.STATUS_FEED_URL ?? "https://www.githubstatus.com/api/v2/summary.json";
const FEED_TTL_MS = Number(process.env.STATUS_FEED_TTL ?? 60_000);

let cachedSummary:
  | {
      data: z.infer<typeof summarySchema>;
      fetchedAt: number;
      latencyMs: number;
    }
  | null = null;

async function fetchSummaryOnce() {
  const startedAt = Date.now();
  const response = await fetch(FEED_URL, {
    next: { revalidate: 60 },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Status feed request failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const data = summarySchema.parse(json);
  const latencyMs = Date.now() - startedAt;
  return { data, latencyMs };
}

export async function getStatusSummary() {
  if (cachedSummary && Date.now() - cachedSummary.fetchedAt < FEED_TTL_MS) {
    return cachedSummary;
  }

  const result = await pRetry(fetchSummaryOnce, { retries: 2 });
  cachedSummary = { ...result, fetchedAt: Date.now() };
  return cachedSummary;
}

export type DerivedMetric = {
  label: string;
  value: string;
  description: string;
};

export type MonitoringComponent = {
  id: string;
  name: string;
  status: "up" | "degraded";
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

export type PlatformSnapshot = {
  metrics: DerivedMetric[];
  monitoring: MonitoringComponent[];
  incidents: IncidentItem[];
  statusBanner: {
    message: string;
    indicator: string;
    uptime30d: string;
    updatedAt: string;
    latencyMs: number;
  };
  feedUrl: string;
};

export async function getPlatformSnapshot(): Promise<PlatformSnapshot> {
  const { data, latencyMs } = await getStatusSummary();
  const components = data.components.filter((component) => !component.group);
  const totalComponents = components.length;
  const operationalComponents = components.filter((component) => component.status === "operational");
  const degradedComponents = components.filter((component) => component.status !== "operational");

  const metrics: DerivedMetric[] = [
    {
      label: "Работающих компонентов",
      value: `${operationalComponents.length}/${totalComponents}`,
      description: "Количество подсистем в статусе operational по данным статус-страницы",
    },
    {
      label: "Деградации",
      value: String(degradedComponents.length),
      description: "Подсистемы c частичным простоем или инцидентом",
    },
    {
      label: "Плановые работы",
      value: String(data.scheduled_maintenances.length),
      description: "Активные maintenance окна",
    },
    {
      label: "Описание статуса",
      value: data.status.description,
      description: `Indicator: ${data.status.indicator}`,
    },
  ];

  const monitoring: MonitoringComponent[] = components.slice(0, 6).map((component) => ({
    id: component.id,
    name: component.name,
    status: component.status === "operational" ? "up" : "degraded",
    description: component.description ?? null,
  }));

  const incidents: IncidentItem[] = data.incidents.slice(0, 5).map((incident) => ({
    id: incident.id,
    name: incident.name,
    impact: incident.impact,
    status: incident.status,
    url: incident.shortlink ?? null,
    lastUpdate: incident.incident_updates[0]?.body,
  }));

  const statusBanner = {
    message: data.status.description,
    indicator: data.status.indicator,
    uptime30d: `${((operationalComponents.length / Math.max(totalComponents, 1)) * 100).toFixed(2)}%`,
    updatedAt: data.page.updated_at,
    latencyMs,
  };

  return {
    metrics,
    monitoring,
    incidents,
    statusBanner,
    feedUrl: data.page.url,
  };
}
