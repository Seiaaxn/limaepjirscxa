import { Sparkles } from "lucide-react";
import { onImgError } from "../lib/site-images";

export const HERO_BANNER_URL = "https://cdn.nekohime.site/file/505luemy.jpg";

/**
 * Banner 16:9 ala KyzzAPI — dipakai di dalam kartu hero.
 * Gambar lebar dengan overlay gradient, chip label, dan caption di kiri bawah.
 */
export function HeroBanner({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="group relative mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-sm">
      <img
        src={HERO_BANNER_URL}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        loading="lazy"
        decoding="async"
        onError={onImgError}
      />
      {/* Overlay gradient — gelap di bawah agar teks terbaca */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, oklch(0.15 0.01 90 / 0.82) 0%, oklch(0.15 0.01 90 / 0.35) 45%, transparent 75%)",
        }}
        aria-hidden
      />
      {/* Grid pattern halus di atas gambar */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(1 0 0 / 0.14) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.14) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />

      {/* Caption */}
      <div className="absolute right-0 bottom-0 left-0 p-5 md:p-8">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[0.65rem] font-bold tracking-widest uppercase"
          style={{
            background: "oklch(1 0 0 / 0.14)",
            color: "oklch(0.97 0.005 95)",
            border: "1px solid oklch(1 0 0 / 0.28)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Sparkles className="h-3 w-3" />
          {eyebrow}
        </span>
        <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        <p className="mt-1 max-w-xl text-xs md:text-sm" style={{ color: "oklch(0.92 0.005 95)" }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
