// ============================================================
//  PENGATURAN TOKO — cukup ubah file ini untuk ganti harga,
//  produk, nomor WhatsApp, alamat, dan jam buka.
// ============================================================
window.HIFANA_CONFIG = {
  // Nomor WhatsApp format internasional, tanpa "+" dan tanpa spasi.
  // 0838-7301-9191  ->  6283873019191
  waNumber: "6283873019191",

  namaToko: "Warung Hifana",
  alamatWarung: "[Isi alamat Warung Hifana di config.js]",
  jamBuka: "Setiap hari, 07.00–20.00 WIB",

  // Harga reseller berlaku jika total botol >= minimal ini.
  resellerMinQty: 10,

  // Daftar produk. Tambah item baru dengan format yang sama.
  products: [
    {
      id: "kunyit-250",
      nama: "Kunyit Asem 250 ml",
      deskripsi: "Botol PET, segar hari ini",
      harga: 8000,
      hargaReseller: 6500,
      gambar: "img/produk.jpg",
      tersedia: true
    }
    // Contoh produk tambahan (hapus tanda // untuk mengaktifkan):
    // ,{
    //   id: "kunyit-1000",
    //   nama: "Kunyit Asem 1 liter",
    //   deskripsi: "Untuk keluarga / acara",
    //   harga: 28000,
    //   hargaReseller: 25000,
    //   gambar: "img/produk.jpg",
    //   tersedia: true
    // }
  ]
};
