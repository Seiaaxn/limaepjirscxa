import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  ClipboardCheck,
  ArrowRight,
  BadgeCheck,
  TrendingUp,
  Activity,
  Clock,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BackButton } from "../components/BackButton";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { WA_URL_SELECTION, GEN_MEMBER_COUNTS } from "../lib/site-config";
import { useI18n } from "../lib/i18n";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join · Five Fail Family" },
      {
        name: "description",
        content:
          "Bergabung ke Five Fail Family lewat satu jalur seleksi untuk semua tipe creator - preset, L2D, anime, manhwa, dan manhua.",
      },
      { property: "og:title", content: "Join · Five Fail Family" },
      {
        property: "og:description",
        content: "Selalu open recruitment - ikuti jalur seleksi untuk bergabung kedalam grup",
      },
    ],
  }),
  component: JoinPage,
});

const reqIcons = [Users, Sparkles, ShieldCheck];
const totalMembers = GEN_MEMBER_COUNTS.reduce((sum, g) => sum + g.count, 0);
const TICKS = 12;

/* ── Live motion hooks (pola yang sama dengan /system) ────────── */
function useTicks(base: number, jitter: number, cap: number) {
  const [values, setValues] = useState<number[]>(() => Array(TICKS).fill(base));
  useEffect(() => {
    const id = setInterval(() => {
      setValues((prev) => {
        const last = prev[prev.length - 1] ?? base;
        const next = Math.max(
          4,
          Math.min(cap, last + (Math.random() - 0.45) * jitter * 2),
        );
        return [...prev.slice(1), Math.round(next)];
      });
    }, 1600);
    return () => clearInterval(id);
  }, [base, jitter, cap]);
  return values;
}

function useSessionClock() {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const origin = Date.now();
    const id = setInterval(() => setSec(Math.floor((Date.now() - origin) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const W = 600,
    H = 80,
    MAX = 100;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * W},${H - (v / MAX) * H}`)
    .join(" ");
  const id = `join-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#${id})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "all 700ms ease-out" }}
      />
    </svg>
  );
}

function LivePanel() {
  const activity = useTicks(38, 9, 92);
  const slots = useTicks(64, 6, 96);
  const clock = useSessionClock();
  const activityPct = activity[activity.length - 1] ?? 0;
  const slotsPct = slots[slots.length - 1] ?? 0;

  return (
    <section className="mx-auto mt-14 max-w-4xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Live Recruitment Metric</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Aktivitas pendaftaran & ketersediaan slot secara realtime
          </p>
        </div>
        <span className="chip" style={{ color: "var(--accent-3)" }}>
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ background: "var(--accent-3)" }}
          />
          Live
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            icon: Activity,
            title: "Recruitment Activity",
            sub: "Estimasi lonjakan pendaftar per menit",
            pct: activityPct,
            values: activity,
            color: "var(--accent-2)",
          },
          {
            icon: Users,
            title: "Slot Availability",
            sub: "Kapasitas seleksi yang masih terbuka",
            pct: slotsPct,
            values: slots,
            color: "var(--accent-3)",
          },
        ].map((p, i) => (
          <div
            key={p.title}
            className="glass-card animate-rise p-6"
            style={{ animationDelay: `${i * 110}ms` }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                  style={{
                    background: `color-mix(in oklab, ${p.color} 14%, white)`,
                    color: p.color,
                  }}
                >
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.sub}</p>
                </div>
              </div>
              <p className="font-display text-2xl font-bold tabular-nums" style={{ color: p.color }}>
                {Math.round(p.pct)}%
              </p>
            </div>
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${p.pct}%`, background: p.color }}
              />
            </div>
            <div className="mt-5 rounded-xl bg-secondary/50 p-2">
              <Sparkline values={p.values} color={p.color} />
            </div>
            <p className="mt-2 text-right font-mono text-[0.65rem] tracking-wider text-muted-foreground uppercase">
              {TICKS} tick · auto refresh
            </p>
          </div>
        ))}
      </div>

      <div className="glass-card animate-rise mt-4 flex flex-wrap items-center justify-between gap-3 p-5">
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Sesi kamu berjalan
        </span>
        <span className="font-mono text-lg font-bold tabular-nums">{clock}</span>
      </div>
    </section>
  );
}

function JoinPage() {
  const { t } = useI18n();
  const j = t.join;
  const heroRef = useRef<HTMLDivElement>(null);

  const path = {
    ...j.path1,
    url: WA_URL_SELECTION,
    icon: ClipboardCheck,
  };

  const genTints = ["var(--accent-4)", "var(--accent-2)", "var(--accent-3)"];

  return (
    <main className="relative min-h-[calc(100vh-64px)] px-4 pb-20">
      <div className="mx-auto max-w-4xl pt-8">
        <BackButton />
      </div>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section ref={heroRef} className="mx-auto max-w-4xl pt-4 text-center">
        <span className="chip animate-rise">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          {j.badge}
        </span>
        <h1
          className="font-display animate-rise mt-5 text-4xl font-bold tracking-tight md:text-5xl"
          style={{ animationDelay: "80ms" }}
        >
          {j.title}
        </h1>
        <p
          className="animate-rise mx-auto mt-4 max-w-xl text-muted-foreground"
          style={{ animationDelay: "140ms" }}
        >
          {j.desc}
        </p>

        {/* Trust bar */}
        <div
          className="animate-rise mx-auto mt-7 flex max-w-2xl flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "200ms" }}
        >
          <span className="chip">
            <TrendingUp className="h-3.5 w-3.5" />
            <AnimatedCounter value={totalMembers} suffix="+" /> {t.common.members}
          </span>
          <span className="chip">
            <BadgeCheck className="h-3.5 w-3.5" />
            100% Gratis
          </span>
          <span className="chip">
            <Zap className="h-3.5 w-3.5" />3 Generasi Aktif
          </span>
        </div>
      </section>

      {/* ── Live metric (motion seperti /system) ───────────────── */}
      <LivePanel />

      {/* ── Single selection path ──────────────────────────────── */}
      <section className="mx-auto mt-14 max-w-4xl">
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl font-bold">{j.pathsTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{j.pathsDesc}</p>
        </div>

        <article className="glass-card animate-rise overflow-hidden">
          {/* Header strip */}
          <div className="flex flex-col gap-3 border-b border-border bg-secondary/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="animate-pulse-ring grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                <path.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">
                  {path.label}
                </p>
                <h3 className="font-display text-lg font-bold leading-tight">{path.title}</h3>
              </div>
            </div>
            <span className="chip w-fit shrink-0">{path.badge}</span>
          </div>

          {/* Body */}
          <div className="flex flex-col p-6">
            <p className="text-sm font-semibold">{path.audience}</p>
            <p className="mt-2 text-sm text-muted-foreground">{path.desc}</p>

            {/* Mini gen summary */}
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {j.genRequirements.map((g, i) => (
                <div
                  key={g.gen}
                  className="animate-rise flex items-center justify-between rounded-xl border px-3 py-2.5 transition-transform hover:-translate-y-0.5"
                  style={{
                    animationDelay: `${i * 90}ms`,
                    borderColor: `color-mix(in oklab, ${genTints[i]} 30%, white)`,
                    background: `color-mix(in oklab, ${genTints[i]} 8%, white)`,
                  }}
                >
                  <span className="font-mono text-xs font-bold tracking-widest uppercase">
                    {g.gen}
                  </span>
                  <span
                    className="font-mono text-xs font-bold"
                    style={{ color: genTints[i] }}
                  >
                    {g.followers > 0 ? `${g.followers}+` : "Bebas"}
                  </span>
                </div>
              ))}
            </div>

            <a
              href={path.url}
              target="_blank"
              rel="noopener"
              className="btn-primary mt-6 self-start"
            >
              <MessageCircle className="h-4 w-4" />
              {path.cta}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </article>
      </section>

      {/* ── Requirements ───────────────────────────────────────── */}
      <section className="mx-auto mt-14 max-w-4xl">
        <h2 className="font-display mb-5 text-2xl font-bold">{j.reqTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {j.requirements.map((r, i) => {
            const Icon = reqIcons[i] ?? Sparkles;
            return (
              <div
                key={r.title}
                className="glass-card glass-card-hover animate-rise p-5"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-secondary">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-3 font-semibold">{r.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Selection flow ─────────────────────────────────────── */}
      <section className="glass-card animate-rise mx-auto mt-14 max-w-4xl p-6 md:p-8">
        <h2 className="font-display text-lg font-bold">{j.flowTitle}</h2>
        <ol className="mt-5 space-y-0">
          {j.flow.map((step, i) => (
            <li
              key={step}
              className="animate-rise flex items-start gap-3"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="flex flex-col items-center">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent font-mono text-xs font-bold text-accent-foreground">
                  {i + 1}
                </span>
                {i < j.flow.length - 1 && (
                  <span
                    className="mt-1 mb-1 w-0.5 flex-1 bg-border"
                    style={{ minHeight: 20 }}
                  />
                )}
              </div>
              <span className="pt-1 pb-4 text-sm text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="mx-auto mt-14 max-w-4xl">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold">{j.faqTitle}</h2>
          <span className="font-mono text-xs text-muted-foreground">
            {j.faqs.length} {j.faqCount}
          </span>
        </div>
        <div className="glass-card p-2 md:p-4">
          <Accordion type="single" collapsible className="w-full">
            {j.faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className={i === j.faqs.length - 1 ? "border-b-0" : "border-border"}
              >
                <AccordionTrigger className="rounded-lg px-3 hover:bg-secondary/60 hover:no-underline">
                  <span className="font-medium">{f.q}</span>
                </AccordionTrigger>
                <AccordionContent className="px-3 text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────── */}
      <section className="glass-card animate-rise mx-auto mt-14 max-w-4xl p-6 text-center md:p-8">
        <h3 className="font-display text-xl font-bold">{j.ctaTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{j.ctaDesc}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <a href={WA_URL_SELECTION} target="_blank" rel="noopener" className="btn-primary">
            <ClipboardCheck className="h-4 w-4" />
            {j.path1.cta}
          </a>
        </div>
        <div className="mt-4">
          <Link
            to="/readme"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {j.readme}
          </Link>
        </div>
      </section>
    </main>
  );
}
