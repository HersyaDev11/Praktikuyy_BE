# Praktikuyy Backend (CMS & Blockchain)

Backend sistem informasi manajemen pembelajaran (CMS / LMS) untuk aplikasi **Praktikuyy**. Project ini dibangun dengan teknologi *Hybrid* (Web2 + Web3) untuk menghadirkan fitur-fitur modern seperti **Penyimpanan Nilai On-Chain** dan penerbitan **Sertifikat kelulusan dalam bentuk NFT**.

## 🚀 Fitur Utama

- **Authentication & Role-based Access**: Login dan pendaftaran untuk Admin, Dosen, dan Mahasiswa menggunakan JWT.
- **Manajemen Kelas & Modul**: Operasi CRUD penuh untuk mengelola kelas, jadwal, dan modul materi.
- **Sistem Penugasan**: Fitur untuk memberikan dan mengumpulkan tugas.
- **Blockchain Integration (Web3)**:
  - **Sertifikat NFT**: Mahasiswa yang lulus akan otomatis dicetakkan sertifikat digital berbasis ERC721 yang aman dan anti-pemalsuan.
  - **Nilai On-Chain**: Nilai akhir mahasiswa dicatat secara transparan dan permanen (immutable) ke dalam jaringan Blockchain menggunakan *Smart Contract*.

## 🛠️ Tech Stack

- **Backend Framework**: Node.js & Express.js
- **Database & ORM**: PostgreSQL & Prisma ORM
- **Blockchain Framework**: Hardhat, Ethers.js
- **Smart Contracts**: Solidity, OpenZeppelin (ERC721)
- **Authentication**: JWT & bcryptjs

## 📦 Prasyarat

Pastikan kamu sudah menginstal hal-hal berikut di sistem kamu:
- [Node.js](https://nodejs.org/) (versi 18+)
- [PostgreSQL](https://www.postgresql.org/) (yang sedang berjalan)

## ⚙️ Cara Menjalankan Project

### 1. Instalasi Dependensi
Clone repository ini, masuk ke folder project, lalu jalankan perintah instalasi:
```bash
npm install
npm install @openzeppelin/contracts
```

### 2. Setup Environment Variables
Buat file `.env` di root folder dan isi dengan variabel berikut:
```env
# URL Database Postgres kamu
DATABASE_URL="postgresql://username:password@localhost:5432/praktikuy_db?schema=public"

# Rahasia untuk JWT
JWT_SECRET="rahasia_jwt_praktikuyy_super_aman"

# Konfigurasi Hardhat / Local Node
PROVIDER_URL="http://127.0.0.1:8545"
PRIVATE_KEY="private_key_wallet_kamu"

# Akan didapat setelah Smart Contract di-deploy
CERTIFICATE_CONTRACT_ADDRESS="alamat_contract_sertifikat"
GRADES_CONTRACT_ADDRESS="alamat_contract_nilai"
```

### 3. Migrasi Database (Prisma)
Push schema Prisma untuk membuat tabel di dalam database PostgreSQL:
```bash
npx prisma db push
npx prisma generate
```

### 4. Menjalankan Blockchain Lokal & Deploy Smart Contract
Buka dua terminal terpisah.

**Terminal 1 (Jalankan Node):**
```bash
npx hardhat node
```
Biarkan terminal ini tetap menyala.

**Terminal 2 (Deploy Contract):**
```bash
npx hardhat run scripts/deploy.js --network localhost
```
*Catat alamat contract yang muncul di layar, dan masukkan ke dalam file `.env`!*

### 5. Jalankan Server API
Setelah database siap dan smart contract sudah ter-deploy, kamu bisa menjalankan server utama:
```bash
node index.js
```

Server backend sekarang berjalan dan dapat diakses!

## 📄 License
Project ini dikembangkan untuk kebutuhan perlombaan Praktikuyy.
