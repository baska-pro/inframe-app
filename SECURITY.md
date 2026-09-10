# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| Latest release | Yes |
| Older releases | Best effort |

## Reporting a vulnerability

Jangan membuka issue publik untuk kerentanan yang dapat dieksploitasi.

Laporkan secara privat kepada maintainer melalui kanal kontak pada profil GitHub:

https://github.com/baska-pro

Sertakan:

- versi atau commit yang terdampak;
- langkah reproduksi minimal;
- dampak dan skenario eksploitasi;
- browser/platform yang digunakan;
- saran mitigasi jika tersedia.

Jangan mengirim token, cookie sesi, password, atau data pengguna sebenarnya.

## Security model

InFrame App menampilkan target lintas origin menggunakan iframe. Beberapa batasan utama:

- Wrapper tidak dapat membaca atau memodifikasi DOM target cross-origin.
- Target harus mengizinkan embedding; GAS sebaiknya menggunakan `HtmlService.XFrameOptionsMode.ALLOWALL` bila memang ingin di-iframe.
- `VITE_ALLOW_URL_OVERRIDE` dinonaktifkan secara default.
- Bila URL override diaktifkan, `VITE_ALLOWED_HOSTS` harus membatasi host yang diperbolehkan.
- Nilai `VITE_*` berada di bundle client dan tidak boleh digunakan untuk menyimpan secret.
- Sandbox iframe hanya boleh dimatikan jika diperlukan dan konsekuensinya dipahami.

## Dependency security

Repository menjalankan Dependabot, dependency review pada pull request, dan CodeQL untuk JavaScript/TypeScript. Temuan security harus diperbaiki berdasarkan dampak dan exploitability, bukan hanya nomor severity.
