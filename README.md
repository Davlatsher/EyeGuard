# 👁️ EyeGuard

Windows uchun zamonaviy ko'z himoyasi ilovasi. Kompyuter oldida uzoq vaqt o'tiruvchi foydalanuvchilar uchun non-intrusive, gamified desktop ilova.

## ✨ Xususiyatlar

- ⏱️ **Smart Timer** — 20-20-20 qoidasi, Pomodoro, custom interval
- 🔒 **Screen Overlay** — Ekran bloklash, gentle/strict/camouflage rejimlar
- 🎮 **Mini Games** — Ko'z mushaklarini mashq qildiradigan 5 ta o'yin
- 📊 **Analytics** — Eye health score, streaks, progress
- 🔕 **Non-Intrusive** — Xalaqitsiz ogohlantirishlar
- 🔒 **Privacy First** — Barcha ma'lumotlar lokal saqlanadi

## 🛠️ Tech Stack

- **Backend**: Rust (Tauri)
- **Frontend**: React + TypeScript + Tailwind CSS
- **State**: Zustand
- **Animation**: Framer Motion
- **Database**: SQLite

## 🚀 O'rnatish

### Talablar
- [Rust](https://rustup.rs/) (latest)
- [Node.js](https://nodejs.org/) v18+
- Windows 10/11

### Loyihani ishga tushirish

```bash
# 1. Klonlash
git clone https://github.com/Davlatsher/EyeGuard.git
cd EyeGuard

# 2. Dependencielarni o'rnatish
npm install

# 3. Tauri dev mode
npm run tauri:dev

# 4. Build qilish (production)
npm run tauri:build
```

## 📁 Loyiha Tuzilishi

```
eyeguard/
├── src-tauri/          # Rust backend
│   ├── src/
│   │   ├── main.rs
│   │   ├── commands.rs
│   │   ├── timer.rs
│   │   ├── notifications.rs
│   │   └── database.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/                # React frontend
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── TimerSettings.tsx
│   │   ├── BreakOverlay.tsx
│   │   ├── Analytics.tsx
│   │   └── MiniGames/
│   │       ├── FollowDot.tsx
│   │       ├── BlinkTrainer.tsx
│   │       └── FocusShift.tsx
│   ├── store/
│   │   └── useStore.ts
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## 🎯 Mini O'yinlar

| O'yin | Tavsifi | Davomiyligi |
|-------|---------|-------------|
| **Nuqtani Kuzat** | Harakatlanuvchi nuqtani bosish | 20 soniya |
| **Ko'z Yumish** | Animatsiya bilan yumish-ch yumish | 30 soniya |
| **Fokus Almashtirish** | Yaqin/uzoq fokus mashqi | 20 soniya |
| **Rang Tanish** | Ranglarni eslab qolish | 30 soniya |
| **Nafas Olish** | Nafas bilan ko'z dam olish | 1 daqiqa |

## 📝 License

MIT License — [LICENSE](LICENSE)

---

**Davlatsher** tomonidan yaratilgan ❤️
