# Product Requirements Document (PRD)
**Project Name:** OmniPlay (Cloud Gaming Ecosystem)  
**Document Version:** 2.0.0 (Revamped User Experience)  
**Date:** 23 September 2026  

## 1. Executive Summary
OmniPlay bertransisi menjadi platform *Cloud Gaming* yang sangat ramah pengguna dengan pemisahan antarmuka yang tegas antara **Pelanggan (User)** dan **Administrator (Admin)**. Fokus utama adalah memberikan pengalaman penyewaan *cloud gaming* yang instan, integrasi pustaka game yang terhubung langsung dengan ekosistem Steam, dan optimalisasi akses perangkat seluler sebagai kontroler virtual.

## 2. Role-Based Architecture (Admin vs. User)

### 2.1 Customer/User Interface (Clean & Focused)
Pelanggan **TIDAK AKAN** melihat data metrik server, CPU load, atau syslog. UI pelanggan dirancang senyaman antarmuka konsol modern.
- **Rent-to-Play Flow:** 
  1. Pilih Game.
  2. Pilih Node Cloud (Misal: Singapore Premium).
  3. **Time Slider:** Pelanggan memilih durasi sewa menggunakan *slider* (1 jam hingga 5 jam).
  4. **Dynamic Pricing:** Harga sewa akan terakumulasi secara otomatis di layar berdasarkan durasi yang dipilih sebelum melakukan pembayaran.
- **Tujuan UI:** Mengurangi kebingungan kognitif. Pengguna hanya tahu: *Pilih, Bayar, Main.*

### 2.2 Administrator Interface (Infrastructure Mode)
Ini adalah UI khusus (seperti pada *screenshot* sebelumnya) yang disembunyikan dari pelanggan.
- **Fitur:** Memonitor *Cloud Edge Node*, melihat *hardware load* (RTX 4090 VRAM, AMD EPYC), dan memantau daftar pengguna (*Active Sessions*) yang sedang menggunakan server secara *real-time*.

## 3. Core Features Revamp

### 3.1 Steam-Integrated Library (Real-Time Metadata)
- **Detail Game:** Mengklik game di halaman "Library" tidak lagi menampilkan data statis. Sistem akan melakukan *fetch* data melalui **Steam Web API** untuk menampilkan sinopsis, *rating* ulasan (Overwhelmingly Positive, dll), dan *screenshot* asli dari Steam.
- **One-Click Start:** Tombol utama **"Start Now"** akan dikonfigurasi menggunakan *Steam URL Protocol* (`steam://run/<AppID>`) yang secara otomatis menjembatani sesi *cloud* langsung ke sistem Steam pengguna.

### 3.2 Mobile Pivot: OmniRemote (Virtual Gamepad & Hub)
Fitur "Companion" taktis sebelumnya **DIPUSATKAN ULANG** menjadi alat pendamping seluler yang universal.
- **Virtual Controller:** Jika pengguna membuka web OmniPlay di HP, mereka dapat mengubah layar menjadi *Virtual Gamepad* (dengan D-Pad dan tombol aksi visual) yang terhubung ke Cloud GPU via WebSocket latensi rendah. Sangat cocok jika pengguna tidak memiliki *controller* fisik.
- **Social Hub:** Menjadi pusat notifikasi, *chatting* dengan teman, dan melihat siapa yang sedang *online* tanpa perlu meminimalkan game yang sedang berjalan di layar PC.

## 4. UI/UX & Motion Design Guidelines (Pro Max Standard)

### 4.1 Aesthetic Loading States (Kritis)
- **Transition Spinners:** Setiap kali pengguna berpindah menu (misalnya dari Library ke Analytics), layar tidak boleh berkedip kosong. Harus ada **Premium Loading Spinner** (animasi cincin neon berputar, atau logo OmniPlay yang berdenyut mulus).
- **Smooth Routing:** Transisi antar halaman harus menggunakan efek *fade-in/fade-out* (kurva *easing* bezier) untuk memberikan kesan aplikasi desktop kelas atas (*Native Feel*).

### 4.2 Tombol Export (Aturan Tetap)
Pada halaman *Performance Analytics*, tombol **Export** tetap dipertahankan HANYA sebagai 1 (satu) tombol utama yang memunculkan *dropdown* (PDF & JSON), sesuai dengan pedoman desain anti-clutter.

## 5. Next Steps for Development
1. Buat mekanisme *Routing* (misal: React Router) untuk memisahkan `/dashboard/user` dan `/dashboard/admin`.
2. Implementasikan *Steam Web API* di *backend* Python.
3. Desain antarmuka *OmniRemote* untuk *viewport* berukuran *mobile*.