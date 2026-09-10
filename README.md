<p align="center">
  <img src="assets/banner.svg" alt="InFrame App" width="100%" />
</p>

# InFrame App

Universal full-screen URL wrapper untuk menampilkan web app di balik URL milik sendiri. Fokus utama proyek ini adalah **Google Apps Script Web App**, tetapi dapat dipakai untuk situs lain selama server tujuan mengizinkan embedding melalui iframe.

## Fitur

- Target URL tidak lagi hard-coded; konfigurasi melalui environment variable.
- Dukungan khusus Google Apps Script dengan auto-crop info bar/banner bagian atas.
- Forward query parameter ke GAS, misalnya `/?id=123&mode=view`.
- URL override opsional dengan allowlist domain agar wrapper publik tidak menjadi open redirect/open iframe.
- Full-screen responsif untuk desktop dan ponsel.
- Loader, retry, dan fallback `Buka URL asli` bila login/cookie/iframe dibatasi.
- Sandbox iframe yang aman secara default dan dapat dimatikan hanya jika diperlukan.
- Siap deploy ke Vercel dan memiliki GitHub Actions untuk type-check + production build.

## 1. Persiapan Google Apps Script

Agar Web App GAS dapat dimuat dalam iframe, response HTML perlu mengizinkan framing:

```javascript
function doGet(e) {
  return HtmlService
    .createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Nama Aplikasi')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
```

Deploy sebagai **Web app**, lalu gunakan URL deployment yang berakhiran `/exec`, contoh:

```text
https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

> `ALLOWALL` menghapus header X-Frame-Options milik HtmlService. Ini tidak menghapus isi HTML Google secara langsung; karena GAS berada di origin berbeda, wrapper tidak dapat memodifikasi DOM di dalam iframe. InFrame menyelesaikan bagian visual tersebut dengan crop/offset pada frame.

## 2. Setup lokal

```bash
git clone https://github.com/baska-pro/inframe-app.git
cd inframe-app
cp .env.example .env
npm install
npm run dev
```

Ubah `.env` minimal:

```env
VITE_TARGET_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
VITE_APP_TITLE=Nama Aplikasi
```

Sebelum deploy:

```bash
npm run check
```

## 3. Setup Vercel

Import repository ini ke Vercel, lalu tambahkan Environment Variables berikut pada **Production / Preview / Development** sesuai kebutuhan:

```text
VITE_TARGET_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
VITE_APP_TITLE=Nama Aplikasi
```

Konfigurasi build sudah disediakan di `vercel.json`:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

Setelah environment variable berubah, lakukan redeploy agar nilai `VITE_*` masuk ke build baru.

## 4. Menghilangkan info bar Google Apps Script

Default untuk URL GAS:

```env
VITE_AUTO_CROP_GAS_BANNER=true
VITE_GAS_BANNER_HEIGHT=40
```

Jika banner masih terlihat, naikkan bertahap, misalnya `44`, `48`, atau `52`. Jika bagian atas aplikasi justru terpotong, turunkan nilainya atau matikan auto-crop:

```env
VITE_AUTO_CROP_GAS_BANNER=false
VITE_FRAME_OFFSET_TOP=0
```

Untuk uji cepat tanpa redeploy, offset dapat dioverride dari query:

```text
https://domain-wrapper.example/?frameOffset=48
```

## 5. Forward parameter ke GAS

Dengan default `VITE_FORWARD_QUERY_PARAMS=true`, URL:

```text
https://domain-wrapper.example/?id=123&mode=detail
```

akan membuka target GAS sebagai:

```text
https://script.google.com/macros/s/DEPLOYMENT_ID/exec?id=123&mode=detail
```

Parameter internal `url`, `frameOffset`, dan `title` tidak diteruskan.

## 6. Satu deployment untuk beberapa target (opsional)

Mode ini **OFF secara default**. Aktifkan hanya jika memang dibutuhkan:

```env
VITE_ALLOW_URL_OVERRIDE=true
VITE_ALLOWED_HOSTS=script.google.com,script.googleusercontent.com,app.example.com
```

Lalu target dapat dipilih melalui:

```text
https://domain-wrapper.example/?url=https%3A%2F%2Fscript.google.com%2Fmacros%2Fs%2FDEPLOYMENT_ID%2Fexec
```

Host override harus cocok dengan `VITE_ALLOWED_HOSTS`. Jangan isi wildcard `*`.

## Environment variables

| Variable | Default | Fungsi |
| --- | --- | --- |
| `VITE_TARGET_URL` | kosong | URL utama yang dibungkus. Wajib untuk penggunaan normal. |
| `VITE_APP_TITLE` | `InFrame App` | Judul tab dan loader. |
| `VITE_AUTO_CROP_GAS_BANNER` | `true` | Auto-crop untuk target GAS. |
| `VITE_GAS_BANNER_HEIGHT` | `40` | Tinggi crop default GAS dalam px. |
| `VITE_FRAME_OFFSET_TOP` | auto | Paksa crop tertentu. |
| `VITE_FORWARD_QUERY_PARAMS` | `true` | Teruskan query wrapper ke target. |
| `VITE_SHOW_CONTROLS` | `false` | Tampilkan tombol reload/external. |
| `VITE_LOADING_HELP_AFTER` | `7` | Detik sebelum fallback ditampilkan. |
| `VITE_ALLOW_URL_OVERRIDE` | `false` | Izinkan `?url=` mengganti target. |
| `VITE_ALLOWED_HOSTS` | kosong | Allowlist host untuk override. |
| `VITE_DISABLE_SANDBOX` | `false` | Matikan iframe sandbox untuk kompatibilitas khusus. |

## Troubleshooting

**Halaman kosong / refused to connect**  
Pastikan target memang mengizinkan iframe. Untuk GAS, gunakan `setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)` dan deploy versi terbaru.

**Login Google tidak bekerja di iframe**  
Sebagian alur autentikasi dan browser membatasi third-party cookies. Gunakan tombol `Buka URL asli` atau ubah arsitektur login agar tidak bergantung pada third-party iframe cookies.

**Bagian atas aplikasi terpotong**  
Kurangi `VITE_GAS_BANNER_HEIGHT`, set `VITE_FRAME_OFFSET_TOP=0`, atau matikan auto-crop.

**Perubahan `.env` tidak terlihat di Vercel**  
Environment variable Vite disisipkan saat build. Redeploy setelah mengubah nilai `VITE_*`.

## Security

Target utama dari environment variable dianggap tepercaya oleh pemilik deployment. Runtime URL override sengaja dimatikan secara default dan, bila diaktifkan, wajib melewati host allowlist. Jangan memasukkan secret, token, password, atau kredensial ke variable `VITE_*` karena seluruh nilai Vite yang dipakai client dapat dibaca dari browser setelah build.

## Teknologi

React 19 · TypeScript · Vite · Lucide React · Vercel

## Version

Current stable: **v1.0.0 — Universal Wrapper**
