# 🏎️ Gembalap

Game balapan pseudo-3D bergaya pixel (ala OutRun) untuk dimainkan bareng anak. Isi bensin sesuai jumlah bendera, cocokkan warna mobil dengan warna jalur, lalu menang lawan komputer! Dikunci landscape.

## Cara main
1. **Garasi** — pilih mobil, lintasan, kesulitan, dan bantuan bensin.
2. **Pom Bensin** — hitung bendera di lintasan. 1 bendera = 1 kotak bensin (1 kotak = 2 koin).
3. **Balapan** — lewati warna yang sama dengan mobilmu untuk dapat **BOOST** 🔥. Bensin kurang = diderek truk.

| Mode | Cara |
|---|---|
| Mudah | 4 jalur berwarna, pindah jalur ◀ ▶. Warna jalur diacak tiap bendera. |
| Normal | Tanpa jalur. Setir bebas kiri-kanan; hanya beberapa petak berwarna di aspal. |
| Sulit | Seperti Normal, tapi jalannya berbelok dan tikungan mendorong mobil ke luar. |

Lawan: 2 mobil komputer (bisa saling tabrak). Cuaca acak: hujan membuat jalan licin. Bensin tambahan bisa diambil di jalan. Garage = mobil, Lemari = helm & baju. Mulai dengan 1 mobil; mobil lain dibeli pakai koin. Kustom: pembalap (cowok/cewek, topi, baju) dan mobil (warna, aksesori, livery). Petunjuk jarak: Bendera / Jari / Dadu.

Kontrol: tombol ◀ ▶ di layar, panah / A D di keyboard, atau geser di layar.

## Pasang di HP
Buka lewat https lalu pilih **Add to Home Screen** / **Install app** (PWA).

## Pengembangan
```
npm install
npm run build      # menghasilkan dist/index.html (+ version.json)
```
`index.html` di root adalah hasil build (untuk GitHub Pages). Sumber ada di `src/main.js` + `template.html`. UI memakai EZUI dari Ezventure (`ui-kit/`).

Roadmap: v0.3 multiplayer (PeerJS), APK.

## v0.4 — gaya pixel pseudo-3D
- Mesin gambar diganti: kanvas 2D beresolusi rendah (tinggi 180 px) diperbesar tanpa penghalusan, jalan digambar per baris, semua benda adalah sprite piksel (mobil tampak belakang, pohon, rumah, gedung, bendera, gerbang finish).
- Three.js dihapus; ukuran file turun dari ~600 KB menjadi ~85 KB.
- Logika game, musik, menu, hujan, tabrakan, dan bensin tidak berubah.
- Versi 3D voxel terakhir ada di commit `cc75a28` (v0.3.1).
