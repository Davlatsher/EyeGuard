# 🛠️ EyeGuard — Development Reja (Texnik Yo'l Xaritasi)

> Versiya: 1.0 · Sana: 2026-07 · Holat: v1.0.0 MVP kodi asosida tuzilgan

## 1. Hozirgi Holat Tahlili (Audit)

### 1.1 Nima tayyor ✅
| Qism | Holat | Izoh |
|------|-------|------|
| UI/UX dizayn | 90% | Dashboard, Settings, Analytics, BreakOverlay — zamonaviy, animatsiyali |
| State management | 80% | Zustand store to'liq tuzilgan |
| Mini-o'yinlar | 60% | 3/5 tayyor (FollowDot, BlinkTrainer, FocusShift) |
| Break rejimlar | 70% | Gentle/Strict/Camouflage UI'da ishlaydi |
| Rust skeleti | 40% | 11 ta command, tray, DB sxema — lekin stub holida |

### 1.2 Kritik muammolar 🔴
| # | Muammo | Jiddiylik | Fayl |
|---|--------|-----------|------|
| 1 | **Tauri v1/v2 muvofiqsizligi**: `Cargo.toml` v2.0, lekin kod v1 API (`SystemTray`, `tauri::api::notification`, v1 `tauri.conf.json`). **Loyiha kompilyatsiya bo'lmaydi.** | 🔴 Blocker | `src-tauri/*` |
| 2 | Frontend ↔ Backend ulanmagan — birorta `invoke()` chaqiruvi yo'q | 🔴 Kritik | `src/*` |
| 3 | SQLite'ga hech narsa yozilmaydi — `save_break_record` bo'sh stub | 🔴 Kritik | `commands.rs` |
| 4 | Statistika mock (hardcoded): `streak: 5`, `totalBreaks: 127`, haftalik grafik | 🟠 Yuqori | `useStore.ts`, `Analytics.tsx` |
| 5 | Timer holati saqlanmaydi — restart qilsa hammasi nolga tushadi | 🟠 Yuqori | `useStore.ts` |
| 6 | 2 ta o'yin yo'q: Rang Tanish (`color`), Nafas Olish (`breathing`) | 🟠 Yuqori | `MiniGames/` |
| 7 | Overlay real OS-darajali oyna emas — faqat ilova ichidagi div (`create_overlay_window` chaqirilmaydi) | 🟠 Yuqori | `BreakOverlay.tsx` |
| 8 | Ikonkalar yo'q (`icons/icon.png` mavjud emas) — build uziladi | 🟠 Yuqori | `src-tauri/icons/` |
| 9 | Tailwind dinamik klasslar (`bg-${color}-500/10`) — JIT purge'da o'chib ketadi | 🟡 O'rta | `MiniGames.tsx`, `TimerSettings.tsx` |
| 10 | Break duration slider `readOnly` — o'zgartirib bo'lmaydi | 🟡 O'rta | `TimerSettings.tsx` |
| 11 | Custom timer rejimi aslida sozlanmaydi (30 min qattiq kodlangan) | 🟡 O'rta | `useStore.ts` |
| 12 | Testlar umuman yo'q (0% coverage) | 🟡 O'rta | — |

---

## 2. Faza 0 — Poydevor (2–3 hafta) → v1.0.1 "Buildable"

**Maqsad: loyiha kompilyatsiya bo'lsin, o'rnatilsin va asosiy sikl real ishlasin.**

> ✅ **BAJARILDI** (2026-07, commit `abb5d30`/`26f7841`). Tekshirildi: `cargo check` 0 ogohlantirish, 6 Rust unit-test o'tdi, frontend `tsc` + `vite build` muvaffaqiyatli.

- [x] **Tauri 2.x'ga to'liq migratsiya**
  - `main.rs` + `lib.rs`: `SystemTray` → `TrayIconBuilder`, plugin arxitekturasi
  - `notifications.rs`: `tauri-plugin-notification`
  - `tauri.conf.json` → v2 format (`app`, `bundle`, `capabilities/default.json`)
  - `#[tokio::main]` o'rniga Tauri async runtime (`tauri::async_runtime::spawn`)
  - _Bonus:_ single-instance + autostart pluginlari
- [x] **Ikonkalar to'plami** (`icons/`: 32x32, 128x128, icon.ico, icon.icns) — `tauri icon` generatori
- [x] **Frontend ↔ Backend ulash**: `src/lib/tauri.ts` service qatlami — `invoke()` + event listener'lar (timer-tick / break-due / stats-updated), browser fallback bilan
- [x] **SQLite real ishlashi**: to'liq CRUD (settings, break_records, daily_stats, streak, eye-health) — `Mutex<Connection>` tauri state ichida
- [x] **Sozlamalar persistensiyasi**: store hydrate + har o'zgarishda DB'ga yozish
- [x] **CI/CD**: GitHub Actions — `tsc` + `vite build` + `cargo fmt/check/test` + Windows bundle artifact
- [x] **Smoke testlar**: 6 ta Rust unit-test (settings roundtrip, break CRUD, summary, daily_stats, streak, eye-health clamp)
- [x] _Qo'shimcha topilma:_ o'zbekcha apostrof (`Ko'z`) JS string literallarni buzayotgani 9 faylda tuzatildi — kod ilgari **umuman kompilyatsiya bo'lmagan**

**Chiqish mezoni:** `npm run tauri:build` → ishlaydigan `.msi`, tanaffus sikli to'liq: timer → notification → overlay → yozuv DB'ga. _(Windows bundle CI'da yig'iladi; Linux muhitida kod-daraja tekshiruvi bajarildi.)_

## 3. Faza 1 — Haqiqiy MVP (4–6 hafta) → v1.1 "Public Beta"

**Maqsad: foydalanuvchiga berib bo'ladigan, halol ishlaydigan mahsulot.**

- [x] **Real overlay oynasi** ✅: strict rejimda haqiqiy fullscreen always-on-top OS oyna (`create_overlay_window` + `?overlay=1` marshruti + `OverlayView`); tanaffus tugagach yozuv saqlab, timer reset qilib, o'zini yopadi. _(Windows runtime CI'da; overlay UI brauzerda tekshirilgan)_
- [x] **Idle detection** ✅: 60s harakatsizlikda timer pauza (`system.rs`, Win32 `GetLastInputInfo` FFI; boshqa OS'da no-op)
- [x] **Fullscreen ilova aniqlash** ✅: video/o'yin/prezentatsiya paytida pauza (`SHQueryUserNotificationState` FFI); DND bilan birga `timer-paused` event chiqaradi
- [x] **2 ta yetishmagan o'yin**: ✅ Rang Tanish (farqli rang topish), Nafas Olish (4-4-6 breathing) — commit `4ce4cb8`, brauzerda tekshirilgan
- [x] **Real analytics** ✅ (commit `94fa39d`): recharts BarChart (haftalik tanaffuslar) + AreaChart (salomatlik dinamikasi), `get_daily_stats`'dan real DB ma'lumot; streak/health backend'da real; browser preview uchun demo fallback
- [x] **Eye Health Score algoritmi** ✅ hujjatlashtirilgan (Faza 0, `database.rs`): base 50 +10/bajarilgan −5/o'tkazilgan, 0–100 clamp
- [x] **Autostart** ✅ (`tauri-plugin-autostart` + Sozlamalardagi toggle real OS autostart bilan)
- [x] **Tovushlar** ✅: Web Audio API bilan yumshoq ikki-notali chime (`lib/sound.ts`), break-due'da `sound_enabled` bo'lsa chalinadi — asset kerak emas, CSP-safe
- [x] **Custom rejim UI** ✅ (commit `ad8385a`): break duration slider + custom interval slider (5–60 min) — backend `custom_interval` DB'da saqlanadi, `set_interval` command, startup'da tiklanadi
- [x] **i18n**: ✅ uz / ru / en (react-i18next) — commit `eddc3e1`, til tanlagich + 3 tilda tekshirilgan
- [x] **Onboarding** ✅: birinchi ochilishda 3-qadam tanishtiruv (`Onboarding.tsx`), `localStorage` flag bilan bir marta ko'rsatiladi; skip/back/next + progress nuqtalari, uz/ru/en tarjimalar — brauzerda tekshirilgan
- [ ] **Code signing** + MSI/NSIS installer, auto-updater endpoint sozlash

## 4. Faza 2 — Monetizatsiya va O'sish (6–8 hafta) → v1.5 "Pro"

- [x] **Freemium bo'linishi** ✅ (commit `ee17deb`, `lib/pro.ts`):
  - Free: 20-20-20 timer, gentle rejim, 2 o'yin (followdot/blink), 7 kunlik statistika
  - Pro: barcha rejimlar, 5 o'yin, 30-kun statistika, custom timer — gating + upgrade modal bilan
- [x] **Litsenziya tizimi** (asosiy) ✅: offline ed25519 litsenziya kaliti (`lib/license.ts`, `@noble/ed25519`), aktivatsiya UI, developer tools (`scripts/`). _Qoldi:_ Paddle/LemonSqueezy to'lov integratsiyasi (webhook + haqiqiy sotib olish)
- [x] **Gamifikatsiya chuqurligi** ✅ (commit `8ac120d`): 10 ta yutuq (achievements), daraja/XP tizimi (LevelCard + AchievementsGrid + unlock toast). _Qoldi:_ haftalik challenge'lar
- [x] **Light theme** + rang temalar ✅ (`lib/theme.ts`): CSS-o'zgaruvchili palitra (slate/sky/indigo/white Tailwind ranglari `rgb(var(--…))` orqali) — komponentlarni qayta yozmasdan dark ↔ light almashadi. Light/dark bepul; 3 accent tema (Zumrad/Binafsha/Atirgul) Pro. `data-theme`/`data-accent` `<html>`da, localStorage'da saqlanadi, Sozlamalarda tanlagich. Brauzerda dark/light + accent tekshirilgan (regressiyasiz)
- [ ] **Ixtiyoriy telemetriya** (opt-in, faqat anonim events) — mahsulot qarorlari uchun
- [ ] **Veb-sayt**: landing + to'lov + yuklab olish + changelog
- [ ] **Microsoft Store** listing

## 5. Faza 3 — Kengayish (Q1–Q2 2027)

- [ ] macOS versiyasi (Tauri cross-platform — 70% kod tayyor), keyin Linux
- [ ] **EyeGuard Teams (B2B)**: markaziy admin panel, jamoa statistikasi, MDM deploy, SSO
- [ ] Cloud sync (ixtiyoriy account) — qurilmalar orasida statistika
- [ ] Smart break AI: ish ritmiga qarab tanaffus vaqtini moslashtirish
- [ ] Mobil hamroh-ilova (statistika ko'rish, eslatmalar)

## 6. Texnik Qarzlar va Sifat

| Yo'nalish | Chora |
|-----------|-------|
| Test coverage | Maqsad: store 90%, Rust commands 80%, kritik oqim E2E (WebDriver) |
| Tailwind dinamik klasslar | `safelist` yoki klass-map'ga o'tkazish |
| Xavfsizlik | CSP saqlansin; updater `pubkey` majburiy; DB fayl ruxsatlari |
| Performance | Idle'da CPU <1%, RAM <150MB maqsad; overlay ochilishi <100ms |
| Arxitektura | Timer logikasini backend'ga ko'chirish (yagona haqiqat manbai Rust'da, frontend faqat ko'rsatadi) — hozir ikkita mustaqil timer bor |

## 7. Resurslar va Muddatlar (yakka dasturchi rejimi)

| Faza | Muddat | Natija |
|------|--------|--------|
| Faza 0 | 2–3 hafta | Buildable v1.0.1 |
| Faza 1 | 4–6 hafta | Public Beta v1.1 (2026 sentabr) |
| Faza 2 | 6–8 hafta | Pro v1.5 + monetizatsiya (2026 noyabr) |
| Faza 3 | 2027 H1 | macOS + Teams |

**Risklar:** Tauri v2 migratsiya kutilganidan og'ir bo'lishi (+1 hafta zaxira); code signing sertifikat narxi (~$100–300/yil, EV bo'lsa qimmatroq); Windows Defender SmartScreen reputatsiya davri.
