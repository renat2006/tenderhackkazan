import { siteConfig } from "@/lib/config/site";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="mt-12 rounded-3xl border border-white/10 bg-slate-900/70 p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Контакты
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Подключим вашу команду к TenderSupply за 48 часов
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Пишите нам — выделим песочницу, настроим вебхуки и дадим доступ к
            рабочим регламентам безопасности.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-slate-200">
          {siteConfig.contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 transition hover:border-white hover:bg-white/5"
            >
              <span className="text-white">{contact.label}</span>
              <span className="text-slate-300">{contact.value}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
