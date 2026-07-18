# 💰 EyeGuard — Sotuv Strategiyasi

> Versiya: 1.0 · Sana: 2026-07

## 1. Biznes Model: Freemium + B2B

Ikki oqim: **B2C freemium** (hajm va brend) + **B2B per-seat** (asosiy daromad, Faza 2+).
Privacy-first pozitsiyaga mos: reklama YO'Q, ma'lumot sotish YO'Q — faqat halol litsenziya.

## 2. Narx Arxitekturasi

### 2.1 B2C tariflar
| | **Free** | **Pro (bir martalik)** | **Pro yillik** |
|---|---|---|---|
| Narx (global) | $0 | **$14.99** lifetime | $6.99/yil |
| Narx (UZ/MDH, PPP) | $0 | **99 000 so'm (~$8)** | 49 000 so'm/yil |
| 20-20-20 timer | ✅ | ✅ | ✅ |
| Gentle rejim | ✅ | ✅ | ✅ |
| O'yinlar | 2 ta | 5+ hammasi | 5+ hammasi |
| Strict + Kamuflyaj rejim | — | ✅ | ✅ |
| Custom timer | — | ✅ | ✅ |
| Statistika | 7 kun | Cheksiz | Cheksiz |
| Multi-monitor | — | ✅ | ✅ |
| Temalar | — | ✅ | ✅ |
| Yutuqlar/challenge | asosiy | hammasi | hammasi |

**Tavsiya — lifetime asosiy taklif:** utility-ilovada obuna charchagan bozorga qarshi "bir marta to'la, umrbod ishlat" kuchli sotuv argumenti (LookAway/Iris tajribasi buni tasdiqlaydi). Yillik variant — B2B'ga ko'prik va past kirish narxini xohlovchilarga.

### 2.2 B2B — EyeGuard Teams (Faza 3)
| Reja | Narx | Nima kiradi |
|------|------|-------------|
| Teams | $3/seat/oy yoki $30/seat/yil | Barcha Pro + admin dashboard, jamoa statistikasi |
| Teams UZ | 25 000 so'm/seat/oy | Mahalliy narx |
| Enterprise | Individual | SSO, MDM deploy, SLA, on-prem statistika |

Minimal paket: 10 seat. Yillik oldindan to'lovga 2 oy bepul.

## 3. Sotuv Kanallari

| Kanal | Komissiya | Rol |
|-------|-----------|-----|
| **O'z sayti** (Paddle yoki LemonSqueezy — merchant-of-record, VAT/soliqni o'zi hal qiladi, UZ dasturchi uchun qulay) | ~5% + $0.50 | Asosiy kanal, maksimal margin |
| **Microsoft Store** | 12% (yoki o'z to'lov tizimi bilan 0%) | Discovery + ishonch |
| **Payme / Click / Uzum** (UZ) | ~2% | Mahalliy to'lovlar — kartasiz auditoriya uchun kritik |
| **AppSumo / lifetime-deal platformalar** | ~70% ulush | Faqat launch bosqichida hajm+review uchun, ehtiyotkorlik bilan |

## 4. B2C Sotuv Voronkasi

```
Yuklab olish (Free)
   ↓  Onboarding + 3 kunlik "birinchi streak" odati
Faol foydalanuvchi (D7)
   ↓  Trigger nuqtalari (quyida)
Pro trial his-tuyg'usi
   ↓  Kontekstli, xalaqit bermas taklif
Pro xarid
   ↓  Referral: "do'stga 20% — o'zingga 1 oy Teams bepul"
Advokat
```

**Pro trigger nuqtalari** (agressiv paywall EMAS — kontekstli):
1. 3-o'yinni ochmoqchi bo'lganda → "Bu o'yin Pro'da"
2. 8-kun statistikani ko'rmoqchi bo'lganda → "Tarixingiz qimmatli — Pro bilan cheksiz"
3. Strict rejimni tanlaganda → "Qat'iy rejim Pro'da"
4. 7 kunlik streak'ka yetganda → bir martalik "tabrik + 30% chegirma 48 soat" (eng yuqori konversiya nuqtasi)

**Qoida:** Free versiya o'z-o'zicha to'liq foydali bo'lishi shart — g'azablangan foydalanuvchi hech qachon Pro olmaydi.

## 5. B2B Sotuv Jarayoni (Faza 3)

### 5.1 Nishon: O'zbekiston IT Park rezidentlari (~1500+ kompaniya) → keyin MDH IT kompaniyalari
**Pitch:** *"Xodimlaringizning 90% i kuniga 8+ soat ekranga qaraydi. Ko'z charchashi = produktivlik pasayishi + sick-day. EyeGuard Teams — $3/xodim, o'lchanadigan wellness."*

### 5.2 Jarayon (founder-led sales)
1. **Lead-gen:** IT Park tadbirlari, HR-hamjamiyatlar, LinkedIn, mavjud Pro foydalanuvchilar ishlaydigan kompaniyalar (ilova ichida "kompaniyangizga taklif qiling" tugmasi)
2. **Pilot:** 30 kun, 20 seat bepul, oxirida jamoa health-report taqdimoti
3. **Yopish:** yillik shartnoma, HR wellness-byudjetidan
4. **Kengaytirish:** seat o'sishi + boshqa bo'limlar

### 5.3 Hamkorlik kanallari
- **Ko'z klinikalari/optikalar:** promo-kod almashinuvi (ular bizni tavsiya qiladi, biz ularni "professional tekshiruv" bo'limida)
- **Sug'urta / korporativ wellness provayderlar:** paket ichiga kirish
- **HR-konsalting agentliklar:** referral 15%

## 6. Daromad Prognozi (12 oy, launch'dan boshlab)

| Ssenariy | Yuklab olish | Konversiya | Pro sotuv | B2B seats | Yillik daromad |
|----------|--------------|------------|-----------|-----------|----------------|
| Konservativ | 20 000 | 1.5% | 300 × ~$11 avg | 0 | **~$3 300** |
| Realistik | 50 000 | 2.5% | 1 250 × ~$11 | 200 × $30 | **~$19 700** |
| Optimistik | 120 000 | 3.5% | 4 200 × ~$11 | 800 × $30 | **~$70 000** |

*(avg $11 — global $14.99 va MDH $8 aralashmasi; PH/HN muvaffaqiyati ssenariyni belgilaydi)*

## 7. Kuzatiladigan Sotuv Metrikalari

| Metrika | Maqsad |
|---------|--------|
| Free → Pro konversiya | ≥ 2.5% (utility bench: 1–5%) |
| ARPU (paid) | ≥ $10 |
| Refund rate | < 3% |
| B2B pilot → paid | ≥ 40% |
| CAC (organik ustunligida) | < $2 |
| LTV/CAC | > 5 |
| Referral ulushi yangi Pro'larda | ≥ 15% |

## 8. Sotuv Tamoyillari

1. **Halollik = brend.** Ko'z salomatligi mavzusida qo'rqitish-marketing (fear-selling) taqiqlanadi — ilmiy fakt + foyda tili
2. **Mahalliy narx — global mahsulot.** PPP-narxlash MDH'da piratlikni ma'nosiz qiladi
3. **Lifetime — kirish, Teams — biznes.** B2C brend va ishonch yaratadi, B2B barqaror daromad beradi
4. **Har chorak narx-testi:** launch chegirmasi ($9.99 birinchi hafta) → asosiy narx → seasonal promo (yangi yil "ko'zga g'amxo'rlik rezolyutsiyasi")
