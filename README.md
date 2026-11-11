# Kunyit Asem Warung Hifana — Website Pemesanan

Website statis untuk memesan kunyit asem. Tidak ada payment gateway: pembeli mengisi
form, lalu tombol **Pesan via WhatsApp** membuka chat ke 0838-7301-9191 dengan rincian
pesanan yang sudah terisi otomatis.

## Isi folder

| File | Fungsi |
|---|---|
| `index.html` | Halaman utama |
| `style.css` | Tampilan |
| `script.js` | Hitung total dan buat pesan WhatsApp |
| `config.js` | **Pengaturan toko**: nomor WA, harga, produk, alamat, jam buka |
| `img/` | Logo dan foto produk |

## Mengubah harga, produk, atau alamat

Buka `config.js`, ubah nilainya, simpan, lalu commit dan push. Vercel otomatis
memperbarui website dalam beberapa detik.

- `waNumber` — nomor WA format `62…` tanpa `+` dan spasi
- `alamatWarung`, `jamBuka` — tampil di bagian bawah halaman
- `resellerMinQty` — jumlah botol minimal untuk harga reseller (default 10)
- `products` — daftar produk; ada contoh produk 1 liter yang tinggal diaktifkan
- `tersedia: false` — menandai produk sedang habis

## Upload ke GitHub

1. Buat repository baru di https://github.com/new (misal `warung-hifana`), pilih **Public**, jangan centang README.
2. Upload file:
   - **Lewat browser:** di repo kosong klik *uploading an existing file*, seret semua isi folder ini (termasuk folder `img`), lalu *Commit changes*.
   - **Lewat terminal:**
     ```bash
     cd warung-hifana
     git init
     git add .
     git commit -m "Website pemesanan Warung Hifana"
     git branch -M main
     git remote add origin https://github.com/USERNAME/warung-hifana.git
     git push -u origin main
     ```

## Hubungkan ke Vercel

1. Masuk ke https://vercel.com dengan akun GitHub.
2. Klik **Add New… → Project**, pilih repo `warung-hifana`, klik **Import**.
3. Framework Preset: **Other**. Build Command dan Output Directory dikosongkan.
4. Klik **Deploy**. Website tayang di `https://warung-hifana.vercel.app` (atau nama serupa).

Setiap push ke branch `main` otomatis ter-deploy ulang.

## Coba di komputer sendiri

Cukup buka `index.html` di browser, atau jalankan `npx serve .` lalu buka alamat yang muncul.
