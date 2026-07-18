# 📣 EyeGuard — Marketing Reja

> Versiya: 1.0 · Sana: 2026-07

## 1. Pozitsiyalash (Positioning)

**Bir jumlada:** *"EyeGuard — ko'zingizni himoya qiladigan, o'ynab dam oldiradigan yagona ilova. Privacy-first, xalaqit bermaydi."*

### 1.1 Nima bilan ajralib turamiz (USP)
1. **Gamifikatsiya** — raqobatchilar (EyeLeo, Stretchly, Workrave) faqat "ekranni yop" deydi; EyeGuard 5 ta ko'z-mashq o'yini, health score, streak bilan odat shakllantiradi
2. **3 xil break rejimi** — Yumshoq / Qat'iy / Kamuflyaj (ish sharoitiga moslashadi; raqobatchilarda odatda bittagina rejim)
3. **Privacy-first** — 100% lokal, hech qanday account/server shart emas
4. **Lokalizatsiya** — o'zbek + rus tillari: MDH bozorida jiddiy raqobatchi lokalizatsiya qilmagan bo'shliq
5. **Zamonaviy UI** — raqobatchilarning ko'pi 2010-yillar dizaynida

### 1.2 Raqobat xaritasi
| Mahsulot | Narx | Kuchli tomoni | Zaif tomoni |
|----------|------|---------------|-------------|
| EyeLeo | Bepul | Sodda | Eskirgan, rivojlanmayapti |
| Stretchly | Bepul (OSS) | Kross-platforma | Gamifikatsiya yo'q, Electron og'ir |
| Workrave | Bepul (OSS) | RSI mashqlari | Juda eski UI |
| Iris | ~$15 | Blue-light + timer | Murakkab, "shubhali" UI |
| LookAway | $25+ | Chiroyli | Faqat macOS |
| **EyeGuard** | Freemium | Gamified + zamonaviy + uz/ru | Yangi, reputatsiya yo'q |

**Xulosa:** Windows'da "chiroyli + gamified" bo'sh nisha. LookAway'ning Windows'dagi ekvivalenti yo'q — biz o'sha bo'shliqni egallaymiz.

## 2. Maqsadli Auditoriya (Segmentlar)

| Segment | Og'riq nuqtasi | Xabar (message) |
|---------|----------------|-----------------|
| **Dasturchilar / IT** (asosiy) | 10+ soat ekran, quruq ko'z | "Kod yozishda ko'zing — asosiy asbobing. Uni himoya qil." |
| **Ofis xodimlari** | Bosh og'rig'i, charchoq | "Kunni bosh og'rig'isiz tugat." |
| **Talabalar / geymerlar** | Uzoq sessiyalar | "Streak'ni saqla — ko'zing uchun o'yin." |
| **Ota-onalar** (bola kompyuteri) | Bola ekrandan ajralmaydi | "Qat'iy rejim — bola uchun majburiy tanaffus." |
| **HR / kompaniyalar** (B2B, Faza 2+) | Xodimlar salomatligi, sick-day | "Jamoangiz ko'z salomatligi — bitta dashboard'da." |

## 3. Bozorga Chiqish Bosqichlari (GTM)

### Bosqich A — Soft Launch: O'zbekiston/MDH (Beta, v1.1 bilan)
Mahalliy bozor — arzon va tez test maydoni; Telegram — asosiy kanal.

- **Telegram**: IT-hamjamiyat kanallari (uzbek dev communities, IT Park rezidentlari, frontend/backend guruhlar) — beta-test e'loni, 100–300 beta foydalanuvchi yig'ish
- **EyeGuard'ning o'z Telegram kanali**: changelog, ko'z salomatligi maslahatlari (kontent-marketing)
- Mahalliy tech-bloggerlar va YouTube obzorchilari (2–3 ta hamkorlik)
- IT Park / hub'larda mini-prezentatsiya, universitet IT fakultetlari
- **Maqsad:** 1 000 o'rnatish, NPS ≥ 40, crash-free ≥ 99%

### Bosqich B — Global Launch (v1.5 Pro bilan)
- **Product Hunt** launch (tayyorlov: hunter topish, GIF-demolar, launch-day jamoasi) — maqsad: top-5 kun natijasi
- **Hacker News** "Show HN" posti (texnik hikoya bilan: "Tauri'da yozilgan, 5MB, Electron emas" — HN buni yaxshi ko'radi)
- **Reddit**: r/productivity, r/software, r/SideProject, r/rust (Tauri stack hikoyasi)
- **Microsoft Store** listing — organik discovery kanali
- **SEO landing**: "20-20-20 rule app", "eye strain reminder windows", "screen break app" kalit so'zlari
- **Maqsad:** 3 oyda 10 000 yuklab olish

### Bosqich C — Doimiy o'sish
- **Qisqa video kontent** (TikTok/Reels/Shorts): "ko'z charchashi" mavzusi viral-friendly — 20-20-20 fakti + ilova demo formatidagi 15-soniyalik roliklar
- **YouTube productivity obzorchilari** bilan hamkorlik (micro-influencer, 10k–100k)
- **Kontent-marketing blog**: ko'z salomatligi, dry-eye, remote-work ergonomikasi (SEO)
- **Ko'z klinikalari / optikalar bilan hamkorlik** (UZ): tavsiyanoma + promo-kod
- **Open-source jamoatchilik**: GitHub'da public repo/issues — dasturchilar orasida ishonch

## 4. Brend va Kontent

- **Ohang:** do'stona, g'amxo'r, ilmiy asosli — qo'rqitmaydigan ("ko'r bo'lasiz!" YO'Q, "ko'zing rahmat aytadi" HA)
- **Vizual:** hozirgi ko'k-indigo dark palitra — saqlansin, brend identifikatsiyasi kuchli
- **Kontent ustunlari (70/20/10):** 70% foydali maslahat (ko'z salomatligi), 20% mahsulot yangiliklari, 10% jamoa/behind-the-scenes
- **Ijtimoiy isbot:** beta-foydalanuvchi tavsiflari, health score skrinshotlari (ulashiladigan "streak card" — virallik mexanikasi ilova ichiga qurilsin)

## 5. Byudjet (minimal, bootstrap)

| Modda | Oyiga | Izoh |
|-------|-------|------|
| Influencer mikro-hamkorlik | $100–300 | MDH bozorida arzon |
| Domen + hosting + email | $20 | Landing statik |
| Dizayn aktivlari (bir martalik) | $200 | Store skrinshotlar, PH galereya |
| Reklama testi (ixtiyoriy) | $100–200 | faqat konversiya isbotlangach |

Asosiy tikish — **organik kanallar** (PH, HN, Reddit, Telegram, SEO): $0 byudjet, yuqori sifatli auditoriya.

## 6. KPI Dashboard

| Metrika | Beta (3 oy) | Launch (6 oy) | 12 oy |
|---------|-------------|----------------|-------|
| Yuklab olishlar | 1 000 | 10 000 | 50 000 |
| WAU | 300 | 2 500 | 12 000 |
| D30 retention | ≥ 25% | ≥ 30% | ≥ 35% |
| Free → Pro konversiya | — | 2% | 3–4% |
| NPS | ≥ 40 | ≥ 45 | ≥ 50 |
| Telegram kanal a'zolari | 500 | 2 000 | 5 000 |

**Eng muhim ko'rsatkich:** D30 retention — break-reminder ilovalarning asosiy o'limi "o'chirib qo'yish". Gamifikatsiya (streak) aynan shu metrikani ko'tarish uchun.
