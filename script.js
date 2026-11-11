(function () {
  "use strict";

  var cfg = window.HIFANA_CONFIG;
  var qty = {}; // id produk -> jumlah

  var rupiah = function (n) {
    return "Rp " + n.toLocaleString("id-ID");
  };

  var $ = function (id) { return document.getElementById(id); };

  // ---------- Isi info statis ----------
  var waBase = "https://wa.me/" + cfg.waNumber;
  $("waFooter").href = waBase;
  $("waFloat").href = waBase + "?text=" + encodeURIComponent("Halo " + cfg.namaToko + ", saya mau tanya soal kunyit asem.");
  $("alamatWarung").textContent = cfg.alamatWarung;
  $("jamBuka").textContent = cfg.jamBuka;
  $("year").textContent = new Date().getFullYear();

  // ---------- Daftar produk ----------
  var list = $("productList");
  cfg.products.forEach(function (p) {
    qty[p.id] = 0;
    var row = document.createElement("div");
    row.className = "product" + (p.tersedia ? "" : " is-off");
    row.innerHTML =
      '<img src="' + p.gambar + '" alt="" width="72" height="72">' +
      '<div class="product-info">' +
        '<p class="product-name"></p>' +
        '<p class="product-desc"></p>' +
        '<p class="product-price"></p>' +
      '</div>' +
      '<div class="stepper" role="group">' +
        '<button type="button" class="step" data-act="minus" aria-label="Kurangi">−</button>' +
        '<input type="number" inputmode="numeric" min="0" max="999" value="0" aria-label="Jumlah">' +
        '<button type="button" class="step" data-act="plus" aria-label="Tambah">+</button>' +
      '</div>';
    row.querySelector(".product-name").textContent = p.nama;
    row.querySelector(".product-desc").textContent = p.tersedia ? p.deskripsi : "Sedang habis";
    row.querySelector(".product-price").textContent = rupiah(p.harga);

    var input = row.querySelector("input");
    var setQty = function (n) {
      n = Math.max(0, Math.min(999, parseInt(n, 10) || 0));
      qty[p.id] = n;
      input.value = n;
      render();
    };
    row.querySelector('[data-act="minus"]').addEventListener("click", function () { setQty(qty[p.id] - 1); });
    row.querySelector('[data-act="plus"]').addEventListener("click", function () { setQty(qty[p.id] + 1); });
    input.addEventListener("input", function () { setQty(input.value); });

    if (!p.tersedia) {
      row.querySelectorAll("button, input").forEach(function (el) { el.disabled = true; });
    }
    list.appendChild(row);
  });

  // ---------- Metode terima ----------
  var alamatField = $("alamatField");
  document.querySelectorAll('input[name="metode"]').forEach(function (r) {
    r.addEventListener("change", function () {
      alamatField.hidden = getMetode() !== "antar";
    });
  });
  function getMetode() {
    return document.querySelector('input[name="metode"]:checked').value;
  }

  // ---------- Hitung ----------
  function compute() {
    var totalQty = 0;
    cfg.products.forEach(function (p) { totalQty += qty[p.id]; });
    var reseller = totalQty >= cfg.resellerMinQty;
    var lines = [];
    var total = 0;
    cfg.products.forEach(function (p) {
      var q = qty[p.id];
      if (!q) return;
      var h = reseller ? p.hargaReseller : p.harga;
      lines.push({ nama: p.nama, qty: q, harga: h, subtotal: q * h });
      total += q * h;
    });
    return { lines: lines, total: total, totalQty: totalQty, reseller: reseller };
  }

  function render() {
    var r = compute();
    var box = $("summaryLines");
    box.innerHTML = "";
    if (!r.lines.length) {
      box.innerHTML = '<p class="muted">Belum ada produk dipilih.</p>';
    }
    r.lines.forEach(function (l) {
      var div = document.createElement("div");
      div.className = "summary-line";
      var a = document.createElement("span");
      a.textContent = l.nama + " × " + l.qty;
      var b = document.createElement("span");
      b.textContent = rupiah(l.subtotal);
      div.appendChild(a); div.appendChild(b);
      box.appendChild(div);
    });
    if (r.reseller) {
      var note = document.createElement("p");
      note.className = "badge";
      note.textContent = "Harga reseller aktif";
      box.appendChild(note);
    }
    $("totalText").textContent = rupiah(r.total);
    $("errorText").textContent = "";

    // update harga tampil di daftar produk
    cfg.products.forEach(function (p, i) {
      var el = list.children[i].querySelector(".product-price");
      el.innerHTML = "";
      if (r.reseller) {
        var s = document.createElement("s"); s.textContent = rupiah(p.harga);
        el.appendChild(s);
        el.appendChild(document.createTextNode(" " + rupiah(p.hargaReseller)));
      } else {
        el.textContent = rupiah(p.harga);
      }
    });
  }

  function formatWaktu(v) {
    if (!v) return "";
    var d = new Date(v);
    if (isNaN(d)) return v;
    return d.toLocaleString("id-ID", {
      weekday: "long", day: "numeric", month: "long",
      hour: "2-digit", minute: "2-digit"
    });
  }

  // ---------- Kirim ke WhatsApp ----------
  $("orderForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var r = compute();
    var nama = $("nama").value.trim();
    var metode = getMetode();
    var alamat = $("alamat").value.trim();
    var waktu = formatWaktu($("waktu").value);
    var catatan = $("catatan").value.trim();

    var err = "";
    if (!r.totalQty) err = "Pilih minimal 1 botol dulu.";
    else if (!nama) err = "Nama belum diisi.";
    else if (metode === "antar" && !alamat) err = "Alamat pengantaran belum diisi.";
    if (err) {
      $("errorText").textContent = err;
      return;
    }

    var msg = [];
    msg.push("Halo " + cfg.namaToko + ", saya mau pesan:");
    msg.push("");
    r.lines.forEach(function (l) {
      msg.push("• " + l.nama + " × " + l.qty + " @ " + rupiah(l.harga) + " = " + rupiah(l.subtotal));
    });
    if (r.reseller) msg.push("(harga reseller, " + r.totalQty + " botol)");
    msg.push("");
    msg.push("*Total: " + rupiah(r.total) + "*");
    msg.push("");
    msg.push("Nama: " + nama);
    msg.push("Cara terima: " + (metode === "antar" ? "Diantar" : "Ambil di warung"));
    if (metode === "antar") msg.push("Alamat: " + alamat);
    if (waktu) msg.push("Waktu: " + waktu);
    if (catatan) msg.push("Catatan: " + catatan);
    msg.push("");
    msg.push("Mohon konfirmasinya, terima kasih.");

    var url = waBase + "?text=" + encodeURIComponent(msg.join("\n"));
    var w = window.open(url, "_blank");
    if (w) { w.opener = null; } else { window.location.href = url; }
  });

  render();
})();
