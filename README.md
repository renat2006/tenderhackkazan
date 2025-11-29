# tenderhackkazan

Легковесная Next.js 16 витрина, заточенная под server-first подход, быстрые пилоты и развёртывание на собственный сервер.

## TL;DR
- SSR по умолчанию. Маршрут `/` пересобирается раз в час (`revalidate = 3600`), новая страница `/status` — каждые 120 секунд ради живого статуса.
- `output: "standalone"` + строгие security headers -> один артефакт для деплоя.
- UI собирается из серверных секций (Hero, Stats, Capabilities, Monitoring, Architecture, Contact, Incidents) поверх `AppShell`.
- Все тексты/навигация лежат в `src/lib/config/site.ts`, а показатели и статус подтягиваются из `src/lib/services/status-feed.ts` — никаких моков в UI.

## Как собирали
- Генерация: `npm create next-app@latest tmp-app -- --ts --app --eslint --src-dir --tailwind false --import-alias "@/*" --use-npm` с переносом файлов из `tmp-app` в корень.
- Node >= 18.18, пакетный менеджер — только npm (lock-файл `package-lock.json`).

## Скрипты
| Команда | Описание |
| --- | --- |
| `npm run dev` | Next dev server (`localhost:3000`) |
| `npm run lint` | `next lint --dir src` — линтер обязателен перед коммитом |
| `npm run type-check` | `tsc --noEmit` — блокируем любые TS ошибки |
| `npm run build` | Production сборка + генерация standalone |
| `npm run start` | Запуск готовой сборки (используйте в Docker/PM2/systemd) |

### Git-хуки
- Husky `pre-commit` автоматически выполняет `npm run lint && npm run type-check && npm run build`.
- Перед коммитом убедитесь, что команда проходит локально, иначе hook прервёт процесс.

## Архитектура UI
- `src/app/(marketing)/page.tsx` — корневой маршрут `/`, рендерит набор секций внутри `AppShell`.
- `src/components/layout/app-shell.tsx` — общий каркас (header/nav/footer) + базовая типографика.
- `src/components/sections/*` — независимые серверные секции (Hero, Stats, Capabilities, Monitoring, Architecture, Contact, Incidents). Можно комбинировать/добавлять новые без правок остальных частей.
- `src/lib/config/site.ts` — конфигурация сайта (навигация, CTA, тексты, контакты). Живые метрики/мониторинг берём только из `src/lib/services/status-feed.ts`.
- `src/lib/utils/cn.ts` — утилиты; сюда добавляем общие хелперы.

### Поток запроса `/`
1. `RootLayout` подключает Geist шрифты и прокидывает `metadata` из `siteConfig`.
2. `AppShell` строит header/nav/CTA и задаёт фон/отступы.
3. Секции получают контент из `siteConfig`, а метрики/мониторинг/инциденты — из `getPlatformSnapshot()` (`src/lib/services/status-feed.ts`).
4. Кэширование управляется на уровне страницы (`export const revalidate = 3600`). При необходимости можно перевести на `cache: "no-store"` внутри конкретных fetch'ей.

## API и вспомогательные маршруты
| Путь | Метод | Назначение |
| --- | --- | --- |
| `/api/health` | GET | JSON `{"status":"ok"}` + SHA деплоя (ENV `VERCEL_GIT_COMMIT_SHA`/`local`). Используется для readiness/liveness. |

## Серверные оптимизации
- `next.config.ts`: `output: "standalone"`, выключен `X-Powered-By`, включён strict mode, typed routes и автоудаление `console.*` (кроме ошибок) в production.
- Tailwind CSS v4 через `globals.css` (без PostCSS-конфига) для минимального cold start.
- Нет клиентских хуков — бандл остаётся лёгким, весь UI рендерится на сервере.

## Переменные окружения
| Имя | Описание | Значение по умолчанию |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Базовый URL (OG, canonical) | `https://tenderhackkazan.localhost` |
| `STATUS_FEED_URL` | Публичный статус-фид (JSON summary) | `https://www.githubstatus.com/api/v2/summary.json` |
| `STATUS_FEED_TTL` | TTL кэша `getPlatformSnapshot()` в миллисекундах | `60000` |

Все секреты держим в `.env.local` / `.env.*.local` (уже в `.gitignore`).

# TenderSupply Platform

Портал для поставщиков и закупщиков: тендеры, каталоги и сделки с гарантией 99.95% доступности и откликом <400 мс.

## Что уже готово
- Серверный Next.js 16 (App Router) с `revalidate = 3600`, строгими security headers и standalone build.
- UI состоит из серверных секций: Hero → Метрики → Возможности → Мониторинг → Архитектура → Контакт, собранных внутри `AppShell` и статус-бара.
- `/api/health` отдаёт uptime, регион, commit и SLO-таргеты для внешних мониторингов.
- Proxy слой (`src/proxy.ts`) добавляет CSP/Permissions-Policy/HTTPS redirect, а `next.config.ts` (компрессия, HTTP keep-alive, кеш заголовков) держит портал безопасным и быстрым.

## Карта проекта
- `src/app/(marketing)/page.tsx` — публичная витрина платформы (маршрут `/`).
- `src/app/status/page.tsx` — отдельная страница со статусом сервиса, обновляется каждые 120 секунд.
- `src/app/api/health/route.ts` + `src/lib/runtime/health.ts` — источник правды для readiness/liveness.
- `src/components/layout/app-shell.tsx` + `status-bar.tsx` — общий каркас и лента статусов, получают `statusBanner` из `getPlatformSnapshot()`.
- `src/components/sections/*` — независимые блоки: `hero`, `stats`, `capabilities`, `monitoring`, `architecture`, `contact`.
- `src/lib/config/site.ts` — навигация, тексты, контакты и metadata.
- `src/lib/services/status-feed.ts` — вытягивает публичный статус-фид (zod валидация + `p-retry`) и отдаёт метрики/мониторинг/инциденты.
- `src/proxy.ts` — CSP/permissions + HTTPS redirect на новом Proxy API.

## Performance & Reliability Guardrails
- `next.config.ts` включает `compress`, `generateEtags`, `images.formats = [avif, webp]`, `httpAgentOptions.keepAlive`, cache headers для `/_next/static/*` и строгие security headers для остальных путей.
- Все навигационные ссылки используют `toRouteHref` → hash переходы не ломают typed routes.
- Tailwind 4 (без дополнительных плагинов) + Geist fonts из `next/font` дают минимальный cold start.
- `/status` обновляется каждые 120 секунд (отдельный `revalidate`), потому что должен показывать свежий статус-фид.
- `StatusBar` получает `statusBanner` из `getPlatformSnapshot()` и синхронно показывает аптайм/latency на всех страницах.
- `MonitoringSection` и `IncidentsSection` черпают данные из того же snapshot-а, поэтому никакого дублирования и моков.

## Скрипты
| Команда | Описание |
| --- | --- |
| `npm run dev` | Локальный сервер (Turbopack) |
| `npm run lint` | `eslint src` (ESLint 9 + `eslint-config-next`) |
| `npm run type-check` | `tsc --noEmit` |
| `npm run build` | Production build (`output: "standalone"`) |
| `npm run start` | Запуск собранного standalone сервера |
| `npm run verify` | Линт + типы + build (используется в git hook) |

Husky `pre-commit` запускает `npm run verify`, поэтому полезно прогонять команду вручную перед коммитом.

## Переменные окружения
| Имя | Описание | Значение по умолчанию |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Базовый URL для metadata и ссылок | `https://tendersupply.localhost` |
| `NEXT_PUBLIC_APP_VERSION` | Версия, отображаемая в health | `0.1.0` |
| `VERCEL_GIT_COMMIT_SHA` / `GIT_COMMIT` | Подставляется автоматически на CI, используется health 체크 | `local` |
| `VERCEL_REGION` / `FLY_REGION` | Регион деплоя для health ответа | `local` |
| `STATUS_FEED_URL` | JSON summary для живой статус-страницы | `https://www.githubstatus.com/api/v2/summary.json` |
| `STATUS_FEED_TTL` | TTL кэша snapshot-а (мс) | `60000` |

Секреты держим только в `.env.local` / `.env.*.local` (они gitignored).

## Наблюдаемость
- `/api/health` отдаёт `{ status, uptimeSeconds, commit, region, version, slo }` и заголовок `Cache-Control: no-store`.
- `getPlatformSnapshot()` (`src/lib/services/status-feed.ts`) тянет `STATUS_FEED_URL`, валидирует JSON через zod, ретраит с `p-retry` и кэширует на `STATUS_FEED_TTL` миллисекунд.
- Все секции (Stats, Monitoring, Incidents, StatusBar) получают данные только из snapshot-а; моки и заглушки запрещены.
- `StatusBar` помечен `role="status"` и `aria-live="polite"`, чтобы уведомления мигом доходили до ассистивных технологий.

## Политика «никаких моков»
- UI может брать контент только из двух источников: статическая копия в `src/lib/config/site.ts` или живая сводка `getPlatformSnapshot()`/`/api/health`. JSON-заглушки и локальные массивы данных под запретом.
- Если нужны новые поля или метрики, расширяйте `src/lib/services/status-feed.ts` или прокидывайте реальные значения через env/фиды. В README и `.github/copilot-instructions.md` фиксируйте любые исключения.

## Безопасность
- CSP + Permissions-Policy + COOP/CORP добавляются через `src/proxy.ts`.
- `next.config.ts` отключает `X-Powered-By`, включает HSTS, Referrer Policy и X-Content-Type-Options.
- Все ссылки на хэши идут через `next/link` (typed routes) — нет лишних `<a>`.
- Контактная форма сейчас статичная; любые формы/загрузки файлов должны проходить валидацию и антивирус так же, как в `capabilities` описано.

## Деплой

### Локально (без Docker)
1. `npm install && npm run verify`
2. `npm run build`
3. Загрузите `.next/standalone`, `.next/static`, `public`, `package.json`, `package-lock.json` на сервер
4. `npm install --omit=dev`
5. `NODE_ENV=production node .next/standalone/server.js`

### Docker (рекомендуется)
```bash
# Production build
docker compose up -d

# Development с hot reload
docker compose -f docker-compose.dev.yml up
```

## CI/CD Pipeline

Пайплайн состоит из двух workflows:

### CI (`.github/workflows/ci.yml`)
**Триггер:** Pull Request в `main`

Запускает:
- ESLint (`npm run lint`)
- TypeScript проверку (`npm run type-check`)  
- Тестовую сборку (`npm run build`)

### CD (`.github/workflows/cd.yml`)
**Триггер:** Push/Merge в `main`

Выполняет:
1. Сборка Docker образа (multi-stage, standalone)
2. Push в GitHub Container Registry (`ghcr.io/renat2006/tenderhackkazan`)
3. SSH на production сервер
4. Pull и запуск нового контейнера
5. Health check

### Секреты GitHub (Settings → Secrets and variables → Actions → Secrets)

Секреты зашифрованы и не видны в логах.

| Секрет | Описание | Обязательный |
| --- | --- | --- |
| `DEPLOY_HOST` | IP или домен production сервера | ✅ |
| `DEPLOY_USER` | SSH пользователь | ✅ |
| `DEPLOY_SSH_KEY` | Приватный SSH ключ (Ed25519 или RSA) | ✅ |
| `DEPLOY_PORT` | SSH порт | ❌ (по умолчанию 22) |
| `GHCR_TOKEN` | Personal Access Token для docker pull на сервере | ✅ |
| `STATUS_FEED_URL` | URL статус-фида | ❌ |

### Как создать GHCR_TOKEN

1. Перейди в **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Generate new token (classic)
3. Выбери scope: **`read:packages`** (только чтение пакетов)
4. Скопируй токен и добавь в секреты репозитория как `GHCR_TOKEN`

### Переменные GitHub (Settings → Secrets and variables → Actions → Variables)

Переменные видны в логах. Используй для конфигурации.

| Переменная | Описание | Обязательный |
| --- | --- | --- |
| `PRODUCTION_URL` | Публичный URL сайта | ✅ |
| `STATUS_FEED_TTL` | TTL кэша статус-фида (мс) | ❌ |

### Как добавить новую переменную

1. **В GitHub:** Settings → Secrets and variables → Actions
2. **В workflow:** Добавь строку в `.github/workflows/cd.yml`:
   ```yaml
   -e MY_NEW_VAR="${{ vars.MY_NEW_VAR }}" \     # для переменных
   -e MY_SECRET="${{ secrets.MY_SECRET }}" \    # для секретов
   ```
3. **Push в main** — контейнер перезапустится с новыми значениями

### Настройка production сервера

1. **Установите Docker:**
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   ```

2. **Создайте deploy пользователя:**
   ```bash
   sudo adduser deploy
   sudo usermod -aG docker deploy
   ```

3. **Настройте SSH ключ:**
   ```bash
   # На локальной машине сгенерируйте ключ
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_key
   
   # Скопируйте публичный ключ на сервер
   ssh-copy-id -i ~/.ssh/deploy_key.pub deploy@YOUR_SERVER
   
   # Приватный ключ добавьте в секреты GitHub как DEPLOY_SSH_KEY
   cat ~/.ssh/deploy_key
   ```

4. **Откройте порт 3000 (или настройте reverse proxy):**
   ```bash
   # UFW
   sudo ufw allow 3000/tcp
   
   # Или через nginx (рекомендуется для production)
   # Раскомментируйте секцию nginx в docker-compose.yml
   ```

5. **Настройте Environment в GitHub:**
   - Settings → Environments → New environment → `production`
   - Добавьте переменную `PRODUCTION_URL`

`/api/health` используйте как readiness/liveness пробу и источник метаданных для мониторингов.

## Дальнейшие шаги
- Добавить закрытые маршруты `(suppliers)` и `(buyers)` с аутентификацией.
- Подключить реальные telemetry источники (Prometheus/WebSocket) к `monitoringSignals`.
- Добавить автоматическую проверку заголовков в `proxy.ts`, чтобы новые политики не ломали дев-среду.
