# EyeGuard — Litsenziya kalitlari (developer tools)

EyeGuard Pro **offline litsenziya** tizimidan foydalanadi (ed25519 imzo).
Server yoki internet kerak emas — ilova ochiq kalit bilan kalitni tekshiradi.

## 1. Kalit juftligini yaratish (bir marta)

```bash
node scripts/gen-keypair.mjs
```

- **PUBLIC KEY** ni `src/lib/license.ts` dagi `LICENSE_PUBLIC_KEY` ga qo'ying.
- **PRIVATE KEY** ni maxfiy saqlang — **hech qachon commit qilmang!**
  (parol menejeri yoki xavfsiz env sifatida saqlang.)

## 2. Mijozga litsenziya kaliti berish

```bash
EYEGUARD_PRIVATE_KEY=<hex_private_key> node scripts/sign-license.mjs mijoz@example.com
```

Chiqqan `EG1....` kalitni mijozga bering. U ilovada
**Sozlamalar → Pro'ga o'tish → Litsenziya kalitim bor** orqali faollashtiradi.

## Xavfsizlik eslatmasi

- Ochiq kalit ilovada bo'ladi (xavfsiz).
- Yopiq kalit faqat sizda — u bilan har kim litsenziya yasay olmaydi.
- Tekshirish frontend'da (client-side) — casual ulashishni to'xtatadi.
  Kelgusida Rust tomonida ham tekshirish qo'shilsa, himoya kuchayadi.
