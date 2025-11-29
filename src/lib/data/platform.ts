export type MetricCard = {
  label: string;
  value: string;
  description: string;
};

export type Capability = {
  title: string;
  description: string;
  detail: string;
};

export type MonitoringSignal = {
  region: string;
  status: "up" | "degraded";
  latencyMs: number;
  lastIncident: string;
  capacity: string;
};

export const platformMetrics: MetricCard[] = [
  {
    label: "Электронных сделок/сутки",
    value: "12 400+",
    description: "фиксация и подписание контрактов в пиковые дни",
  },
  {
    label: "Среднее время отклика",
    value: "240 мс",
    description: "SR-сервер обрабатывает запросы быстрее SLA 400 мс",
  },
  {
    label: "Каталоги поставщиков",
    value: "3 200",
    description: "активных компаний с полным профилем и витриной",
  },
  {
    label: "Объём заявок",
    value: "$96 млн",
    description: "прошло через платформу за последние 30 дней",
  },
];

export const capabilities: Capability[] = [
  {
    title: "Маркетплейс тендеров",
    description: "Единый поиск и фильтры по заказчикам, доступам, категориям.",
    detail: "Поддерживаем загрузку 50k+ объявлений с обновлением каждые 5 минут",
  },
  {
    title: "Каталог поставщика",
    description: "Витрина с ценами, warehouse статусами и быстрой отправкой КП.",
    detail: "Файлы и прайс-листы проходят антивирус и автоматический OCR",
  },
  {
    title: "Процессинг сделок",
    description: "ЭЦП, хеширование и контроль SLA платежей внутри порта",
    detail: "Соответствие 152-ФЗ, хранение audit trail до 5 лет",
  },
  {
    title: "API интеграции",
    description: "Webhook-и и REST для ERP, CRM и складских систем.",
    detail: "Idempotency-key и подпись запросов, QoS с очередями",
  },
];

export const monitoringSignals: MonitoringSignal[] = [
  {
    region: "MSK-1",
    status: "up",
    latencyMs: 182,
    lastIncident: "47 дн назад",
    capacity: "52%",
  },
  {
    region: "KZN-1",
    status: "up",
    latencyMs: 226,
    lastIncident: "62 дн назад",
    capacity: "44%",
  },
  {
    region: "AMS-1",
    status: "degraded",
    latencyMs: 412,
    lastIncident: "2 дн назад",
    capacity: "71%",
  },
];
