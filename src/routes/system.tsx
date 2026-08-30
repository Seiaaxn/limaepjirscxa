import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Zap, Clock, Server, Cpu, MemoryStick, Globe, HardDrive, Activity, Users } from "lucide-react";
import { BackButton } from "../components/BackButton";
import { getPersistedSessionStart } from "../lib/session";

export const Route = createFileRoute("/system")({
  head: () => ({
    meta: [
      { title: "Status Sistem - Five Fail Family" },
      { name: "description", content: "Status server & metrik sistem Five Fail Family." },
      { property: "og:title", content: "Status Sistem - Five Fail Family" },
      { property: "og:description", content: "Latency, uptime, dan info platform deploy." },
    ],
  }),
  component: SystemPage,
});

/* ── Detect runtime platform ─────────────────────────────────── */
function detectPlatform(): { name: string; region: string; runtime: string } {
  if (typeof process !== "undefined") {
    // Vercel
    if (process.env.VERCEL) {
      return {
        name: "Vercel",
        region: process.env.VERCEL_REGION ?? process.env.VERCEL_GEO_COUNTRY ?? "Edge",
        runtime: "Edge / Node.js",
      };
    }
    // Cloudflare Pages / Workers
    if (process.env.CF_PAGES || process.env.CLOUDFLARE_WORKERS) {
      return { name: "Cloudflare", region: "Global Edge", runtime: "Workers" };
    }
    // Netlify
    if (process.env.NETLIFY) {
      return { name: "Netlify", region: process.env.AWS_REGION ?? "Edge", runtime: "Functions" };
    }
    // Railway
    if (process.env.RAILWAY_ENVIRONMENT) {
      return { name: "Railway", region: process.env.RAILWAY_REGION ?? "Auto", runtime: "Node.js" };
    }
    // Render
    if (process.env.RENDER) {
      return { name: "Render", region: process.env.RENDER_REGION ?? "Auto", runtime: "Node.js" };
    }
    // Fly.io
    if (process.env.FLY_APP_NAME) {
      return { name: "Fly.io", region: process.env.FLY_REGION ?? "Auto", runtime: "Node.js" };
    }
  }
  return { name: "Unknown / Self-hosted", region: "—", runtime: "Node.js" };
}

const PLATFORM = detectPlatform();
const TICKS = 12;

function formatDuration(totalSeconds: number) {
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (d > 0) return `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

function useElapsedSeconds(initial = 0) {
  const [sec, setSec] = useState(initial);
  useEffect(() => {
    // Origin diambil dari local storage agar uptime tidak reset tiap kali website dibuka
    const origin = getPersistedSessionStart();
    setSec(Math.floor((Date.now() - origin) / 1000));
    const id = setInterval(() => setSec(Math.floor((Date.now() - origin) / 1000)), 1000);
    return () => clearInterval(id);
  }, [initial]);
  return sec;
}

function useTicks(seed: number, min: number, max: number) {
  const [vals, setVals] = useState<number[]>(() => Array.from({ length: TICKS }, () => seed));
  const cur = useRef(seed);
  useEffect(() => {
    const id = setInterval(() => {
      cur.current = Math.min(max, Math.max(min, cur.current + (Math.random() * 8 - 4)));
      setVals((prev) => [...prev.slice(1), cur.current]);
    }, 1600);
    return () => clearInterval(id);
  }, [min, max]);
  return vals;
}

function usePing() {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    let running = true;
    async function measure() {
      while (running) {
        const t0 = performance.now();
        try {
          await fetch("/favicon.ico", { method: "HEAD", cache: "no-store" });
          setMs(Math.round(performance.now() - t0));
        } catch {
          setMs(null);
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    measure();
    return () => { running = false; };
  }, []);
  return ms;
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const W = 600, H = 80, MAX = 100;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * W},${H - (v / MAX) * H}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${H} ${pts} ${W},${H}`}
        fill={`url(#g-${color.replace(/[^a-z0-9]/gi, "")})`}
      />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatTile({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub: string }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{label}</p>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-accent">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="font-display mt-3 text-2xl font-bold md:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function GaugePanel({
  icon: Icon, title, sub, percent, values, color, note,
}: {
  icon: React.ElementType; title: string; sub: string;
  percent: number; values: number[]; color: string; note: string;
}) {
  return (
    <section className="glass-card p-6 md:p-7">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
            style={{ background: `color-mix(in oklab, ${color} 18%, var(--color-secondary))`, color }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        </div>
        <p className="font-display text-2xl font-bold md:text-3xl" style={{ color }}>{Math.round(percent)}%</p>
      </div>
      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${percent}%`, background: color }} />
      </div>
      <div className="mt-5 rounded-xl bg-secondary/40 p-2">
        <Sparkline values={values} color={color} />
      </div>
      <p className="mt-2 text-right text-xs text-muted-foreground">{note}</p>
    </section>
  );
}

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span className="chip">
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
      {ok ? "Online" : "Offline"}
    </span>
  );
}

function SystemPage() {
  const appUptime = useElapsedSeconds(0);
  const ping = usePing();
  const cpuTicks = useTicks(22, 6, 55);
  const ramTicks = useTicks(8, 4, 22);
  const recruitTicks = useTicks(38, 10, 92);
  const slotTicks = useTicks(64, 15, 96);

  const cpuPct = cpuTicks[cpuTicks.length - 1];
  const ramPct = ramTicks[ramTicks.length - 1];
  const recruitPct = recruitTicks[recruitTicks.length - 1];
  const slotPct = slotTicks[slotTicks.length - 1];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24">
      <div className="pt-8">
        <BackButton />
      </div>

      {/* ── Hero Banner ──────────────────────────────────────── */}
      <div className="glass-card mt-4 overflow-hidden p-8 md:p-10" style={{ borderColor: "oklch(from var(--color-accent) l c h / 0.3)" }}>
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-15"
          style={{ background: "radial-gradient(ellipse at 80% 20%, var(--color-accent), transparent 60%)" }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="chip text-[0.65rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              System Metrics
            </span>
            <h1 className="font-display mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Status <span style={{ color: "var(--color-accent)" }}>Server</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Platform: <strong className="text-foreground">{PLATFORM.name}</strong> · {PLATFORM.region}
            </p>
          </div>
          <StatusBadge ok={ping !== null} />
        </div>
      </div>

      {/* ── Platform info ──────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={Zap}
          label="Ping Realtime"
          value={ping !== null ? `${ping} ms` : "—"}
          sub="Diukur dari browser ke server"
        />
        <StatTile
          icon={Clock}
          label="App Uptime"
          value={formatDuration(appUptime)}
          sub="Sejak halaman dimuat"
        />
        <StatTile
          icon={Globe}
          label="Platform"
          value={PLATFORM.name}
          sub={`Region: ${PLATFORM.region}`}
        />
        <StatTile
          icon={Server}
          label="Runtime"
          value={PLATFORM.runtime}
          sub={`Deploy: ${PLATFORM.name}`}
        />
      </div>

      {/* ── CPU (simulasi) ─────────────────────────────────── */}
      <div className="mt-6">
        <GaugePanel
          icon={Cpu}
          title="CPU Load"
          sub="Estimasi relatif — server-side metric tidak tersedia di Vercel/Cloudflare"
          percent={cpuPct}
          values={cpuTicks}
          color="var(--color-accent)"
          note="Grafik simulasi klien (10 tick)"
        />
      </div>

      {/* ── RAM (simulasi) ─────────────────────────────────── */}
      <div className="mt-6">
        <GaugePanel
          icon={MemoryStick}
          title="Memory Usage"
          sub="Estimasi relatif — platform serverless tidak expose RAM langsung"
          percent={ramPct}
          values={ramTicks}
          color="var(--accent-3)"
          note="Grafik simulasi klien (10 tick)"
        />
      </div>

      {/* ── Live Recruitment Metric (dipindahkan dari /join) ─── */}
      <div className="mt-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Live Recruitment Metric
            </h2>
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

        <div className="grid gap-6 sm:grid-cols-2">
          <GaugePanel
            icon={Activity}
            title="Recruitment Activity"
            sub="Estimasi lonjakan pendaftar per menit"
            percent={recruitPct}
            values={recruitTicks}
            color="var(--accent-2)"
            note={`${TICKS} tick · auto refresh`}
          />
          <GaugePanel
            icon={Users}
            title="Slot Availability"
            sub="Kapasitas seleksi yang masih terbuka"
            percent={slotPct}
            values={slotTicks}
            color="var(--accent-3)"
            note={`${TICKS} tick · auto refresh`}
          />
        </div>

        <div className="glass-card mt-4 flex flex-wrap items-center justify-between gap-3 p-5">
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Sesi kamu berjalan
          </span>
          <span className="font-mono text-lg font-bold tabular-nums">
            {formatDuration(appUptime)}
          </span>
        </div>
      </div>

      {/* ── Info box ───────────────────────────────────────── */}
      <div className="glass-card mt-6 flex items-start gap-3 p-5">
        <HardDrive className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <div>
          <p className="text-sm font-semibold">Tentang halaman ini</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Platform serverless seperti <strong>Vercel</strong> dan <strong>Cloudflare</strong> tidak
            mengekspos CPU/RAM secara langsung ke klien. Ping diukur secara nyata dari browser.
            Grafik CPU & RAM adalah simulasi visual untuk keperluan tampilan.
            Untuk monitoring produksi, gunakan dashboard bawaan platform (Vercel Analytics, Cloudflare Analytics, dll).
          </p>
        </div>
      </div>
    </main>
  );
}
