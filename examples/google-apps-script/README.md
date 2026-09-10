# Google Apps Script example

`Code.gs` menunjukkan konfigurasi minimum agar HTML Service dapat ditampilkan melalui iframe InFrame App.

Gunakan deployment **Web app** dan salin URL `/exec` ke `VITE_TARGET_URL`.

Catatan keamanan: `ALLOWALL` berarti Apps Script tidak memasang header `X-Frame-Options` untuk mencegah framing. Karena itu, aplikasi target sendiri harus menerapkan kontrol akses yang sesuai dan tidak menganggap iframe sebagai mekanisme autentikasi.
