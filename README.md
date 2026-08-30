# Five Fail Family — Website Resmi

Website resmi **Five Fail Family**, marga editor & kreator anime di TikTok. Dibangun dengan
TanStack Start, React, TypeScript, dan Tailwind CSS. Tampilan menggunakan desain modern —
kartu lembut (soft card), radius besar, dan bayangan halus (bukan lagi neobrutalism).

---

## Struktur Website

```
fivexcza-main/
├── public/
│   └── robots.txt
├── src/
│   ├── assets/                    # Aset statis (favicon config, dll)
│   ├── components/
│   │   ├── ui/                    # Komponen UI dari shadcn/ui
│   │   ├── AnimatedCounter.tsx    # Komponen angka animasi
│   │   ├── BackButton.tsx         # Tombol kembali
│   │   ├── NavBar.tsx             # Navigasi atas
│   │   └── TikTokSections.tsx     # Seksi hashtag TikTok live
│   ├── hooks/
│   │   └── use-mobile.tsx         # Hook deteksi perangkat mobile
│   ├── lib/
│   │   ├── error-capture.ts       # Capture error global (server)
│   │   ├── error-page.ts          # Render halaman error fallback
│   │   ├── lovable-error-reporting.ts  # Integrasi error reporting
│   │   ├── site-config.ts         # Konfigurasi utama (URL, jumlah member, dll)
│   │   ├── site-images.ts         # Helper gambar & fallback
│   │   └── utils.ts               # Utility umum (cn, dll)
│   ├── routes/
│   │   ├── __root.tsx             # Root layout (NavBar, Provider, Error boundary)
│   │   ├── index.tsx              # Halaman Beranda
│   │   ├── join.tsx               # Halaman Join / Pendaftaran
│   │   ├── admin.tsx              # Halaman Tim Admin
│   │   ├── generations.tsx        # Halaman Generasi
│   │   ├── system.tsx             # Halaman Status Sistem (banner + metrik realtime)
│   │   ├── readme.tsx             # Halaman Panduan Marga
│   │   ├── $.tsx                  # Halaman 404
│   │   └── sitemap[.]xml.ts       # Sitemap otomatis
│   ├── routeTree.gen.ts           # Route tree (auto-generated saat `dev`/`build`)
│   ├── router.tsx                 # Konfigurasi router
│   ├── server.ts                  # Entry point server (SSR)
│   ├── start.ts                   # Middleware TanStack Start
│   └── styles.css                 # Global CSS & design tokens
├── components.json                # Konfigurasi shadcn/ui
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Halaman & Fitur

### 🏠 Beranda (`/`)
- **Hero section** dengan foto generasi 1–3 dan tagline marga.
- **Slider otomatis** yang menampilkan tiap generasi beserta deskripsi, berganti setiap 4.5 detik. Bisa diklik manual.
- **Statistik member** — jumlah member per generasi dengan animasi counter.
- **Hashtag live** — data hashtag `#5fcreator` langsung dari TikTok public API (views & jumlah video).
- **Footer** dengan link ke TikTok pembuat website.

### 👥 Join (`/join`)
- **Jalur Seleksi** — satu jalur dengan tombol langsung ke grup WhatsApp seleksi.
- **Mini gen summary** — ringkasan syarat followers per generasi (500+ / 200+ / Bebas) di dalam card jalur.
- **Syarat Umum** — umur 13+, creator aktif, siap CN.
- **Alur Seleksi** — 5 langkah proses seleksi ditampilkan sebagai timeline berurutan.
- **FAQ** — 6 pertanyaan umum dengan Accordion collapsible.
- **CTA bawah** dengan link kembali ke Readme.

### 🛡️ Admin (`/admin`)
- **21 admin** ditampilkan dengan foto, nama, dan peran masing-masing.
- **Owner spotlight** — tampilan khusus owner dengan badge "Owner".
- **Pengelompokan per Generasi** — Gen 1, Gen 2, Gen 3, dan Admin Partner ditampilkan dalam grup terpisah.
- **Badge gen** di pojok kanan atas tiap kartu admin (amber = Gen 1, violet = Gen 2, emerald = Gen 3).
- Foto profil ditampilkan bersih tanpa ikon/logo tambahan menempel di atasnya.

### 📊 Status Sistem (`/system`)
- **Banner 16:9** — kartu status "System Metrics / Status Server Realtime / Online".
- **Grid metrik** — Latency Ping, App Uptime, OS Uptime, CPU/Node.
- **CPU Load Realtime** — progress bar + grafik sparkline 10 tick.
- **Penggunaan RAM** — progress bar + grafik sparkline 10 tick.
- Data pada halaman ini disimulasikan di sisi klien (bukan koneksi ke server asli) — ganti
  logika di `src/routes/system.tsx` jika ingin menyambungkannya ke endpoint monitoring
  sungguhan.

### 🔢 Generasi (`/generations`)
- Penjelasan dan deskripsi tiap generasi Five Fail Family.

### 📖 Readme (`/readme`)
- Panduan lengkap marga: tujuan, divisi & peran, dan aturan singkat.
- CTA ke halaman Join.

---

## Konfigurasi Utama

Edit `src/lib/site-config.ts` untuk mengubah:

```ts
// URL grup WhatsApp seleksi
export const WA_URL_SELECTION = "https://chat.whatsapp.com/...";

// Jumlah member per generasi (ditampilkan di beranda & join)
export const GEN_MEMBER_COUNTS = [
  { gen: "Gen 1", count: 322 },
  { gen: "Gen 2", count: 74 },
  { gen: "Gen 3", count: 12 },
];
```

Edit `src/routes/admin.tsx` array `admins` untuk menambah/mengubah data admin.

Edit `src/routes/system.tsx` untuk mengganti data simulasi menjadi data server sungguhan
(misalnya lewat `fetch` ke endpoint monitoring internal).

---

## Desain

Semua token warna & komponen visual (`chip`, `glass-card`, `btn-primary`, `btn-ghost`, dll)
didefinisikan sebagai utility class di `src/styles.css`. Untuk mengubah nuansa warna, cukup
ubah variabel `--accent`, `--accent-2`, `--accent-3`, `--accent-4`, dan `--radius` di file
tersebut — perubahan otomatis berlaku ke seluruh halaman.

---

## Stack Teknologi

| Teknologi | Kegunaan |
|---|---|
| [TanStack Start](https://tanstack.com/start) | SSR framework berbasis Vite |
| [TanStack Router](https://tanstack.com/router) | File-based routing |
| React + TypeScript | UI & type safety |
| Tailwind CSS | Styling utility-first |
| [shadcn/ui](https://ui.shadcn.com/) | Komponen UI (Accordion, Aspect Ratio, dll) |
| Bun | Package manager & runtime |

---

## Development

Pastikan sudah install [Bun](https://bun.sh) atau Node.js.

```sh
# Clone repo
git clone <url-repo>
cd fivexcza-main

# Install dependencies
bun install
# atau: npm install

# Jalankan dev server
bun run dev
# atau: npm run dev
```

Buka `http://localhost:3000` di browser. Saat pertama kali `dev`/`build` dijalankan, TanStack
Router plugin akan meregenerasi `src/routeTree.gen.ts` secara otomatis berdasarkan file di
`src/routes/` — termasuk route baru `/system`.

---

## Deployment

Website ini di-deploy ke platform yang mendukung SSR (Cloudflare Workers, Node.js, dll) via
`src/server.ts` sebagai entry point.

---

*Five Fail Family — Marga editor & kreator anime Indonesia.*
*Website dibuat oleh [@zavedya_](https://www.tiktok.com/@zavedya_)*
