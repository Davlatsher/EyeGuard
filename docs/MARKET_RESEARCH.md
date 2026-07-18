# 🔬 EyeGuard — Chuqur Bozor Tadqiqoti (MDH va Global)

> Sana: 2026-07-18 · Metod: 105 ta parallel tadqiqot agenti, 735 ta tool-chaqiruv, har bir asosiy fakt 3 ovozli adversarial tekshiruvdan o'tkazildi. Rad etilgan da'volar chiqarib tashlandi, tuzatilgan raqamlar kiritildi.

---

## 1. Ehtiyoj: Muammo qanchalik katta?

**Asosiy fakt: har 3 ta kompyuter foydalanuvchisidan ~2 tasi Computer Vision Syndrome (CVS / raqamli ko'z charchashi) belgilariga ega.**

| Ko'rsatkich | Qiymat | Manba |
|-------------|--------|-------|
| Global CVS tarqalganligi (pooled) | **66%** (95% CI: 59–74) — 45 tadqiqot, 17 526 ishtirokchi | [Scientific Reports 2023](https://www.nature.com/articles/s41598-023-28750-6) ✅ tasdiqlangan 3-0 |
| Global CVS tarqalganligi (eng katta meta-tahlil) | **69,0%** (95% CI: 62,3–75,3) — 103 tadqiqot, 66 577 ishtirokchi | [Journal of Optometry 2023](https://www.journalofoptometry.org/en-prevalence-computer-vision-syndrome-a-articulo-S1888429623000304) ✅ 3-0 |
| COVID davri (ekran vaqti oshgach) | **74%** gacha (95% CI: 66–81) | [BMC Public Health 2024 / Future Sci OA 2025](https://www.tandfonline.com/doi/full/10.1080/20565623.2025.2476923) ✅ 3-0 |
| Universitet talabalari | **76,1%** (eng yuqori segment) | J. Optometry 2023 |
| Ishchilar (office workers) | **69,2%** | J. Optometry 2023 |
| Osiyo mintaqasi | **69,9%** (global o'rtachadan yuqori) | J. Optometry 2023 |

**Muhim ogohlantirishlar (halol tahlil):**
- Heterogenlik juda yuqori (I²=99,7%): mamlakatlar bo'yicha 12% (Yaponiya) dan 97% (Pokiston) gacha. Validatsiyalangan CVS-Q so'rovnomasi bilan o'tkazilgan ofis-ishchi tadqiqotlari pastroq ko'rsatadi: 43–67%.
- **MDH davlatlari (O'zbekiston, Rossiya, Qozog'iston) birorta meta-tahlilda yo'q** — mintaqaviy raqam mavjud emas, Osiyo o'rtachasi (~70%) proxy sifatida ishlatiladi.
- ❌ Rad etilgan: "CVS 66% dan 69% ga o'sdi" degan da'vo noto'g'ri — bular ikki xil metodikali parallel 2023 meta-tahlillar, vaqt bo'yicha o'sish emas. To'g'ri ifoda: **"pooled tarqalganlik 66–69% oralig'ida"**.

**Xulosa:** Muammo real, ilmiy hujjatlashtirilgan va tuzilmaviy o'sishda (remote work, ekran vaqti). B2B pitch uchun kuchli asos: CVS ish beruvchiga produktivlik va sog'liq xarajati sifatida tushadi.

---

## 2. Raqobat Landshafti va Aniq Narxlar (2026-07 holatiga)

Har bir narx birlamchi manba (vendor sayti/repo) bo'yicha tekshirildi.

| Ilova | Platforma | Narx (aniq, joriy) | Model | Mashhurlik signali | Holat |
|-------|-----------|--------------------|----|--------------------|-------|
| **EyeLeo** 🇷🇺 | Windows | **Bepul** | Donationware | RU bozorida eng tanilgan (Habr, IRecommend sharhlari) | ⚠️ **Tashlab qo'yilgan** (abandoned, 2026 sharhlar tasdiqlaydi) |
| **Stretchly** | Win/Mac/Linux | **Bepul** (OSS) | Open-source | EyeLeo o'rnini bosuvchi #1 deb tavsiya qilinadi | Faol |
| **Workrave** | Win/Linux | **Bepul** (OSS) | Open-source | RSI-mashqlar bilan, eski avlod | Faol, eski UI |
| **BreakTimer** | Win/Mac/Linux | **Bepul** (OSS) | Open-source | LookAway o'zi Windows userlarni shunga yo'naltiradi | Faol |
| **CareUEyes** | Windows | **~$1,90/oy** PRO + lifetime varianti; edu −50% | Trial→pullik | Windows'dagi eng yaqin pullik raqib | Faol. RU sharh: "6 kundan keyin pul so'raydi" — norozilik signali |
| **Iris (mini Pro)** | Win/Mac/Linux | **$9,99** bir martalik (1 qurilma, yangilanishsiz); bepul cheklangan versiya | Freemium + lifetime | RU lokalizatsiyasi bor | Faol |
| **LookAway** | **faqat macOS** | **$19** (1 qurilma) / **$29** (2 qurilma) / Team **$29/seat** (min 5) — bir martalik, 1 yil yangilanish, keyin ~50% chegirmali uzaytirish | Trial 7 kun → lifetime | PH 4.2/5; 2 ta muvaffaqiyatli Show HN (2023, 2026-06) | Faol, kategoriya sifat-lideri |
| **Blink Eye** ⚡ | Win/Mac/Linux (**Tauri!**) | **$9,99/yil** (1 qurilma), $16,99/yil (2), $39,99/yil (5); Lifetime: **$28,99 / $49,99 / $109,99** (LemonSqueezy) | Freemium (trial + premium) | GitHub: 258⭐, 759 commit, v2.8.0 (2026-07-07); PH ~140 upvote | Faol, yakka dasturchi |
| **f.lux** | Win/Mac/Linux | Bepul (shaxsiy) | — | Boshqa nisha (blue-light) | Faol |
| **Time Out** | macOS | Freemium | — | Mac bozori | Faol |

> ❌ **Tadqiqot davomida tuzatilgan xatolar:** (1) LookAway'ning keng tarqalgan "$14,99" narxi — eskirgan, joriy narx $19/$29. (2) Blink Eye "butunlay bepul" emas — repo kodida to'liq narx jadvali va trial-paywall bor ($9,99/yildan).

### Raqobat xaritasidan strategik xulosalar

1. **Windows'da "premium sifat" bo'sh** — LookAway ($19–29, faqat Mac) darajasidagi mahsulot Windows'da yo'q. LookAway o'zi Windows foydalanuvchilarini bepul BreakTimer'ga yo'naltiradi — pullik alternativa taklif qilolmaydi.
2. **RU/MDH bozorining sevimlisi (EyeLeo) o'lgan** — gamifikatsiyalangan leopard maskoti bilan mashhur bo'lgan, IRecommend'da ijobiy sharhlar to'plagan ilova endi rivojlanmayapti. **Aynan EyeGuard kontseptsiyasi (gamifikatsiya + ko'z mashqlari) uchun isbotlangan, egasiz qolgan talab.**
3. **Blink Eye — eng jiddiy to'g'ridan-to'g'ri raqib**: xuddi shu stack (Tauri+Rust+TS), xuddi shu g'oya, allaqachon RU landing'i bor. LEKIN: 258⭐ = hali kichik; multilingual "planned" holatida; gamifikatsiya/o'yinlar YO'Q; o'zbek tili YO'Q. Bizning farqlash oynamiz — o'yinlar, health score, streak va uz/ru lokalizatsiya.
4. **Narx shipi aniqlandi**: bir martalik $9,99 (Iris) — $29 (LookAway 2-seat); yillik $9,99 (Blink Eye). Bepul OSS uchlik (Stretchly/Workrave/BreakTimer) narx polini $0 qiladi — bepul tier majburiy.

---

## 3. Talab Signallari

| Signal | Dalil | Baho |
|--------|-------|------|
| HN qabuli | LookAway 2 marta muvaffaqiyatli Show HN (2023 va 2026-06) — kategoriya yillar o'tib ham traction beradi | ✅ Ijobiy |
| HN skeptitsizmi | Takrorlanuvchi e'tirozlar: "bepul OSS bor-ku", "timer uchun nega pul", "tanaffus bezovta qiladi" | ⚠️ Pozitsiyalashda hisobga olinsin |
| Jamiyat nimani mukofotlaydi | "Knows when not to interrupt" — aqlli pauza (meeting/video/fokus paytida xalaqit bermaslik) eng ko'p maqtaladi | 💡 Faza 1'dagi idle/fullscreen-detection to'g'ri prioritet |
| PH qabuli | Blink Eye ~140 upvote, LookAway 4.2/5 (17 sharh) — "kichik lekin real" auditoriya | ⚠️ Viral emas, barqaror nisha |
| RU bozori | Habr'da kategoriya bo'yicha faol muhokamalar; EyeLeo'ga IRecommend'da samimiy ijobiy sharhlar (leopard mashqlari maqtaladi) | ✅ Gamifikatsiyaga talab isbotlangan |
| Lokalizatsiya harakati | Blink Eye RU landing chiqargan — yangi o'yinchilar russofonlarni bozor deb biladi | ✅ Bizning gipotezani tasdiqlaydi |

---

## 4. To'lov Qobiliyati (Willingness to Pay)

### 4.1 O'zbekiston iqtisodiy bazasi ✅ (3-0 tasdiqlangan, stat.uz birlamchi manba)

| Ko'rsatkich | Qiymat |
|-------------|--------|
| O'rtacha oylik ish haqi (2025, 9 oy) | **6,17 mln so'm (~$500)**, +19,2% y/y |
| **IT sektori** o'rtacha maoshi | **14,9 mln so'm (~$1 180)** — milliy o'rtachadan 2,4x |
| Toshkent sh. o'rtachasi | 10,3 mln so'm |
| Bank/moliya (eng yuqori) | 16,83 mln so'm |
| Ta'lim (past chegarasi) | 4,1 mln so'm |
| Internet foydalanuvchilari | 32,7 mln (87% penetratsiya) |
| Software bozori | ~$954 mln 2029'ga qadar, ~11,9% CAGR (Statista) |

**Ma'no:** Yadro auditoriya (IT/moliya, Toshkent) uchun 99 000 so'm (~$8) lifetime — kunlik tushlik pulidan arzon, to'lash mumkin. Umumiy iste'molchi uchun esa bepul tier + juda past narxli yillik zarur. G'arbdagi $15–20 narx UZ'da $2–5 ekvivalentiga tushirilishi kerak (PPP).

### 4.2 Kategoriya narx benchmarklari (indie desktop utility)

- Oddiy utility'lar **$2,99–9,99 bir martalik** narxda konvertatsiya qiladi; professional darajali — $19,99–49,99 (Freemius)
- Hard paywall: ~12% download→paid; freemium: ~2% — lekin freemium hajm va ishonch beradi
- Bir martalik to'lov desktop utility'da obunadan yaxshi ishlaydi: *"foydalanuvchi $30 ni bir marta to'laydi, lekin $5/oy hech qachon"* (Indie Hackers)
- PPP-narxlash daromadni 15–122% oshirishi mumkin; rivojlanayotgan bozorlarda 60–80% chegirma hajmni ochadi (PayPro Global)

### 4.3 B2B korporativ wellness benchmarki

- Raqamli wellness platformalar: **$2–12/xodim/oy (PEPM)**
- Bazaviy raqamli dasturlar: $150–400/xodim/yil; tashkilot o'rtacha jami wellness xarajati ~$650/xodim/yil (Avidon Health 2026)
- **Bizning $3/seat/oy (SALES_STRATEGY.md) rejamiz bozor diapazonining pastki qismida — realistik va sotiladigan.**

---

## 5. Bozor Hajmi: TAM / SAM / SOM

> Metodologiya ochiq: raqamlar tasdiqlangan tarqalganlik (66–69%) va rasmiy statistikaga asoslangan taxminiy hisob-kitoblar; MDH uchun CVS-maxsus tadqiqot yo'qligi hisobga olingan.

### Global
| Daraja | Hisob | Hajm |
|--------|-------|------|
| **TAM** | ~1 mlrd knowledge worker × ~66–69% CVS | **~650–700 mln affected foydalanuvchi**; hatto $1 ARPU'da ham ko'p-milliard potentsial |
| **SAM** | Windows desktop (~70% ulush) × pullik utility sotib oladigan rivojlangan+o'suvchi bozorlar | ~100–200 mln realistik qamrov |
| **SOM** (3 yil) | PH/HN/Store organika bilan 50k–500k yuklab olish, 2–3% konversiya | **$50k–500k/yil oralig'i** (indie miqyosda salmoqli) |

### O'zbekiston / MDH
| Daraja | Hisob | Hajm |
|--------|-------|------|
| TAM (UZ) | ~2–2,5 mln kunlik ofis-PC foydalanuvchi × ~66% | **~1,3–1,6 mln** affected |
| SAM (UZ) | IT/moliya/Toshkent yadro (~300–500k yuqori-daromadli PC-xodim) | ~200–350k realistik qamrov |
| SOM (UZ, 2 yil) | Telegram-kanal marketing + IT Park B2B; 20–50k o'rnatish, 2% B2C konversiya + 500–2000 B2B seat | **$15k–80k/yil** |
| MDH (RU+KZ qo'shilsa) | RU ~40+ mln ofis PC useri, EyeLeo vafotidan keyin bo'sh gamified-nisha | SOM 3–5x ko'payadi; to'lov infratuzilmasi (RU) asosiy to'siq |

**Halol baho:** bu "unicorn bozori" emas — bu **barqaror, isbotlangan, kam raqobatli indie/SMB nisha**. Global SOM'ning yuqori chegarasiga LookAway darajasidagi sifat va marketing bilan erishiladi. MDH esa arzon kirish + tabiiy ustunlik (til, EyeLeo merosxo'rligi) beradi.

---

## 6. Yakuniy Baholash: EyeGuard uchun real imkoniyat

### Kuchli tomonlar tasdiqlandi ✅
1. **Muammo ilmiy real va katta** — 66–69% pooled prevalence, ikkita mustaqil yirik meta-tahlil (3-0 tasdiqlangan)
2. **Windows premium-segmenti bo'sh** — kategoriya lideri LookAway Mac'da qulflangan, Windows userlarni bepul ilovaga jo'natadi
3. **MDH'da gamified-talab isbotlangan va egasiz** — EyeLeo (gamified leopard) sevilardi va o'ldi; foydalanuvchi sharhlari aynan gamifikatsiyani maqtagan
4. **B2B narx-rejamiz bozorga mos** — $3 PEPM wellness-byudjetlarning pastki qismida
5. **Uz/ru lokalizatsiya — hech kimda yo'q** (Blink Eye'da "planned")

### Risklar va qarshi kuchlar ⚠️
1. **Bepul OSS uchlik** (Stretchly/Workrave/BreakTimer) — narx polini $0 qiladi; farqlash faqat sifat+gamifikatsiya orqali
2. **Blink Eye** — xuddi shu stack'da 2 yil oldinda, faol rivojlanmoqda (v2.8.0, 2026-07); tezlik muhim
3. **"Timer uchun pul?"** skeptitsizmi (HN) — javob: smart-pause, o'yinlar, analytics — timer emas, odat-tizimi sotamiz
4. **MDH to'lov qobiliyati past** — PPP-narxlash va bepul tier bilan yechiladi; UZ yolg'iz o'zi katta daromad bermaydi, RU/KZ va global kerak
5. **Retention — kategoriyaning asosiy o'limi** — foydalanuvchilar break-ilovalarni o'chirib qo'yadi; streak/gamifikatsiya aynan shunga qarshi qurol

### Strategik verdikt

> **MDH — plackdarm (isbot maydoni), Global — daromad.** EyeLeo merosini uz/ru gamified-ilova bilan egallash arzon va tez ("EyeLeo o'rnini bosuvchi" pozitsiyasi tayyor marketing-burchak). Lekin moliyaviy natijaning ~80% i global kanaldan keladi (PH/HN/MS Store, $14,99 lifetime). Ikkalasini bitta mahsulot bilan qamrash mumkin — shuning uchun i18n (uz/ru/en) Faza 1'da bo'lishi to'g'ri qaror.

### Rejalarga tuzatishlar (tadqiqot natijasida)
1. **SALES_STRATEGY.md dagi $14,99 lifetime narxi to'g'ri pozitsiyada** — LookAway'ning joriy $19'idan biroz past, Iris'dan yuqori. O'zgartirish shart emas, launch'da $9,99 intro-narx bilan boshlash mumkin.
2. **"Aqlli pauza" (meeting/video/fokus-detection) prioritetini oshirish** — jamiyat aynan shuni mukofotlaydi (LookAway 2026 HN launch'ining bosh xabari shu edi).
3. **Marketing'da "EyeLeo alternative" SEO-sahifasi ochish** — abandoned ilova qidiruvlari bizga oqib kelsin (Deskletics allaqachon shunday trafik yig'ayapti).
4. **Blink Eye'ni kvartalda bir monitoring qilish** — eng yaqin harakatlanuvchi raqib.

---

## Manbalar (asosiylari)
- [Scientific Reports 2023 — CVS meta-tahlil, 66%](https://www.nature.com/articles/s41598-023-28750-6)
- [Journal of Optometry 2023 — CVS meta-tahlil, 69%, 103 tadqiqot](https://www.journalofoptometry.org/en-prevalence-computer-vision-syndrome-a-articulo-S1888429623000304)
- [Future Science OA 2025 — CVS comprehensive review](https://www.tandfonline.com/doi/full/10.1080/20565623.2025.2476923)
- [LookAway pricing (joriy)](https://lookaway.com/pricing/) · [Blink Eye GitHub](https://github.com/nomandhoni-cs/blink-eye) · [Iris pricing](https://iristech.co/buy/) · [CareUEyes](https://care-eyes.com/buy.html)
- [EyeLeo (RU)](http://ru.eyeleo.com/) · [Habr obzor](https://habr.com/ru/articles/91839/) · [IRecommend EyeLeo sharhlari](https://irecommend.ru/content/gimnastika-dlya-glaz-ne-otkhodya-ot-kompyutera-lenites-delat-uprazhneniya-dlya-glaz-leopardi)
- [Kun.uz — UZ o'rtacha maosh 2025](https://kun.uz/en/news/2025/10/27/average-monthly-salary-in-uzbekistan-up-19-percent-to-over-uzs-6-million) (birlamchi: stat.uz press-reliz)
- [Statista — UZ software bozori](https://www.statista.com/outlook/tmo/software/uzbekistan)
- [Avidon Health — wellness dastur narxlari 2026](https://avidonhealth.com/hr-people-operations/employee-wellness-program-cost/)
- [Freemius — micro-SaaS pricing](https://freemius.com/blog/micro-saas-pricing-strategies/) · [PayPro Global — regional pricing](https://payproglobal.com/how-to/set-up-regional-pricing/)
- HN: [LookAway Show HN 2023](https://news.ycombinator.com/item?id=37927174) · [LookAway Show HN 2026](https://news.ycombinator.com/item?id=48659483)
