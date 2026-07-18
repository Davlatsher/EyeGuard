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

- [ ] **Tauri 2.x'ga to'liq migratsiya**
  - `main.rs`: `SystemTray` → `tauri::tray::TrayIcon`, plugin arxitekturasi
  - `notifications.rs`: `tauri-plugin-notification`
  - `tauri.conf.json` → v2 format (`app`, `bundle`, capabilities/permissions)
  - `tokio::main` o'rniga Tauri async runtime
- [ ] **Ikonkalar to'plami** (`icons/`: 32x32, 128x128, icon.ico, icon.icns) — `tauri icon` generatori
- [ ] **Frontend ↔ Backend ulash**: `@tauri-apps/api` `invoke()` orqali barcha 11 command; store'ga backend-sync qatlam
- [ ] **SQLite real ishlashi**: `save_break_record`, `get_daily_stats`, `get_settings`/`update_settings` — to'liq CRUD; ulanish pool (tauri state ichida `Mutex<Connection>`)
- [ ] **Sozlamalar persistensiyasi**: zustand `persist` + DB dual-write
- [ ] **CI/CD**: GitHub Actions — `cargo check` + `tsc` + `vite build` + Windows bundle artifact
- [ ] **Smoke testlar**: Rust unit (DB), vitest (store logikasi)

**Chiqish mezoni:** `npm run tauri:build` → ishlaydigan `.msi`, tanaffus sikli to'liq: timer → notification → overlay → yozuv DB'ga.

## 3. Faza 1 — Haqiqiy MVP (4–6 hafta) → v1.1 "Public Beta"

**Maqsad: foydalanuvchiga berib bo'ladigan, halol ishlaydigan mahsulot.**

- [ ] **Real overlay oynasi**: fullscreen, always-on-top, multi-monitor qo'llab-quvvatlash (`create_overlay_window`'ni ishlatish); strict rejimda Escape/Alt+F4 himoyasi (max 3 snooze bilan)
- [ ] **Idle detection**: foydalanuvchi kompyuterdan uzoqlashsa timer avtomatik pauza (Windows `GetLastInputInfo`)
- [ ] **Fullscreen ilova aniqlash**: prezentatsiya/o'yin/video paytida xalaqit bermaslik (Do-Not-Disturb avto)
- [ ] **2 ta yetishmagan o'yin**: Rang Tanish (xotira o'yini), Nafas Olish (4-7-8 breathing + ko'z yumish)
- [ ] **Real analytics**: haftalik/oylik grafiklar DB'dan (recharts allaqachon dependency'da — ishlatilsin), streak hisobi real
- [ ] **Eye Health Score algoritmi** (hujjatlashtirilgan formula): bajarilgan tanaffuslar %, o'yin faolligi, snooze jarimasi, uzluksiz ekran vaqti
- [ ] **Autostart** (`tauri-plugin-autostart`), tray'dagi "Timer: ON" toggle'ini ishlatish
- [ ] **Tovushlar**: yumshoq ogohlantirish ovozlari (sound_enabled bilan)
- [ ] **Custom rejim UI**: interval/davomiylik slider'lari ishlaydigan qilish
- [ ] **i18n**: uz / ru / en (react-i18next) — bozorni kengaytirish uchun shart
- [ ] **Onboarding**: birinchi ochilishda 3-qadam tanishtiruv
- [ ] **Code signing** + MSI/NSIS installer, auto-updater endpoint sozlash

## 4. Faza 2 — Monetizatsiya va O'sish (6–8 hafta) → v1.5 "Pro"

- [ ] **Freemium bo'linishi**:
  - Free: 20-20-20 timer, gentle rejim, 2 o'yin, 7 kunlik statistika
  - Pro: barcha rejimlar, 5+ o'yin, cheksiz statistika, custom timer, multi-monitor, temalar
- [ ] **Litsenziya tizimi**: offline litsenziya kaliti (ed25519 imzo) + Paddle/LemonSqueezy webhook
- [ ] **Gamifikatsiya chuqurligi**: yutuqlar (achievements), darajalar, haftalik challenge'lar
- [ ] **Light theme** + 2–3 rang temalar (Pro)
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
