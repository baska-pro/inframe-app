# Contributing to InFrame App

Terima kasih atas minat untuk meningkatkan InFrame App. Repository ini menerima issue dan pull request, tetapi penggunaan serta distribusi source tetap mengikuti `LICENSE`.

## Development

Persyaratan:

- Node.js 20 atau lebih baru
- npm

Setup:

```bash
git clone https://github.com/baska-pro/inframe-app.git
cd inframe-app
cp .env.example .env
npm install
npm run dev
```

Sebelum membuka pull request:

```bash
npm run lint
npm run build
```

## Aturan perubahan

1. Jangan commit `.env`, token, cookie, kredensial, URL privat, atau deployment secret.
2. Pertahankan konfigurasi default yang aman. Fitur berisiko seperti URL override harus tetap opt-in.
3. Perubahan yang memengaruhi GAS harus mempertimbangkan cross-origin policy dan `XFrameOptionsMode.ALLOWALL`.
4. Jangan menambahkan dependency besar jika fungsi yang sama dapat dicapai dengan API browser atau kode kecil.
5. Dokumentasikan environment variable baru di `.env.example` dan README.
6. Untuk perubahan user-facing, tambahkan catatan pada `CHANGELOG.md` bagian `Unreleased`.

## Commit

Format yang disarankan:

```text
feat: add new capability
fix: correct iframe behavior
chore: update maintenance config
docs: improve setup guide
security: harden target validation
```

## Pull request

PR harus fokus pada satu tujuan, lolos CI, dan tidak membawa data sensitif. Maintainer dapat menolak perubahan yang memperluas penggunaan di luar izin lisensi proyek.
