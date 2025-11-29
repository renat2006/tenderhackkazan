export type NavigationItem = {
  label: string;
  href: string;
  description?: string;
};

export type ContactChannel = {
  label: string;
  value: string;
  href: string;
};

export const siteConfig = {
  name: "TenderSupply Platform",
  shortName: "TenderSupply",
  baseUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://tendersupply.localhost",
  description:
    "Платформа для поставщиков и закупщиков с гарантией высокой доступности, безопасностью и мгновенной подачей заявок.",
  navigation: [
    { label: "Обзор", href: "/#overview" },
    { label: "Метрики", href: "/#metrics" },
    { label: "Возможности", href: "/#capabilities" },
    { label: "Мониторинг", href: "/#monitoring" },
    { label: "Статус", href: "/status" },
    { label: "Архитектура", href: "/#architecture" },
    { label: "Контакты", href: "/#contact" },
  ] satisfies NavigationItem[],
  contacts: [
    {
      label: "Почта",
      value: "ops@tendersupply.dev",
      href: "mailto:ops@tendersupply.dev",
    },
    {
      label: "Telegram",
      value: "@tendersupply",
      href: "https://t.me/tendersupply",
    },
  ] satisfies ContactChannel[],
  hero: {
    eyebrow: "Supplier Reliability Cloud",
    title: "Портал, где поставщики и заказчики встречаются без простоев",
    subtitle:
      "Единая витрина тендеров, каталога и электронных сделок. 99.95% аптайм, доставка страниц <400 мс, контроль транзакций в реальном времени.",
    primaryCta: {
      label: "Запланировать подключение",
      href: "/#contact",
    },
    secondaryCta: {
      label: "Смотреть статус",
      href: "/status",
    },
  },
  capabilities: [
    {
      title: "Маркетплейс тендеров",
      description:
        "Единый поиск и фильтры по заказчикам, уровням допуска и категориям",
      detail: "Импорт 50k+ публикаций каждые 5 минут",
    },
    {
      title: "Каталог поставщика",
      description: "Профиль компании, статусы склада, быстрые КП",
      detail: "Антивирус и OCR для вложений, контроль версий",
    },
    {
      title: "Процессинг сделок",
      description: "ЭЦП, контроль SLA платежей, хранение журналов",
      detail: "Полное соответствие 152-ФЗ и внутренним регламентам",
    },
    {
      title: "API интеграции",
      description: "Webhook-и и REST endpoints для ERP/CRM",
      detail: "Idempotency-key и подпись каждого запроса",
    },
  ],
  valueProps: [
    {
      title: "Высокая доступность",
      description:
        "99.95% SLA, гео-распределённые узлы, автоматический failover. Ваши тендеры не простаивают.",
    },
    {
      title: "Безопасность",
      description:
        "Шифрование данных, ЭЦП, соответствие 152-ФЗ. Аудит каждого действия.",
    },
    {
      title: "Скорость",
      description:
        "Ответ сервера <400 мс, мгновенная подача заявок, push-уведомления о статусах.",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
