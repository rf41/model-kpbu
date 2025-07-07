-- =============================================================================
-- SKRIP UNTUK MEMBUAT DAN MENGISI DATABASE PROFILING RISIKO KPBU
-- DATABASE: POSTGRESQL
-- =============================================================================

-- Menghapus tabel jika sudah ada untuk memungkinkan eksekusi ulang
DROP TABLE IF EXISTS Dokumen;
DROP TABLE IF EXISTS Token;
DROP TABLE IF EXISTS Proyek;
DROP TABLE IF EXISTS PJPK;

-- =============================================================================
-- BAGIAN 1: MEMBUAT STRUKTUR TABEL (CREATE TABLES)
-- =============================================================================

-- Tabel untuk Penanggung Jawab Proyek Kerjasama (PJPK)
CREATE TABLE PJPK (
    ID_PJPK SERIAL PRIMARY KEY,
    Nama_PJPK VARCHAR(255) NOT NULL,
    Tipe VARCHAR(50) NOT NULL -- Contoh: 'Kementerian', 'Pemprov', 'BUMN'
);

-- Tabel utama untuk Proyek
-- Menggunakan tipe data yang sesuai untuk PostgreSQL
CREATE TABLE Proyek (
    ID_Proyek VARCHAR(10) PRIMARY KEY,
    Nama_Proyek VARCHAR(255) NOT NULL,
    Sektor_Proyek VARCHAR(50),
    Status_Proyek VARCHAR(50),
    Durasi_Konsesi_Tahun INT,
    Nilai_Investasi_Total_IDR BIGINT,
    Target_Dana_Tokenisasi_IDR BIGINT,
    Persentase_Tokenisasi DECIMAL(5, 2),
    Profil_Risiko_Prediksi VARCHAR(20),
    ID_PJPK INT REFERENCES PJPK(ID_PJPK)
);

-- Tabel untuk detail Token yang terkait dengan Proyek
CREATE TABLE Token (
    ID_Token SERIAL PRIMARY KEY,
    ID_Proyek VARCHAR(10) NOT NULL REFERENCES Proyek(ID_Proyek),
    Jenis_Token_Utama VARCHAR(50),
    Risk_Level_Ordinal INT,
    Ada_Jaminan_Pokok BOOLEAN,
    Return_Berbasis_Kinerja BOOLEAN
);

-- Tabel untuk melacak kelengkapan dokumen per proyek
CREATE TABLE Dokumen (
    ID_Dokumen SERIAL PRIMARY KEY,
    ID_Proyek VARCHAR(10) NOT NULL REFERENCES Proyek(ID_Proyek),
    Jenis_Dokumen VARCHAR(100),
    Status_Ketersediaan BOOLEAN
);


-- =============================================================================
-- BAGIAN 2: MENGISI DATA MASTER (INSERT MASTER DATA)
-- =============================================================================

INSERT INTO PJPK (Nama_PJPK, Tipe) VALUES
('Kementerian Pekerjaan Umum dan Perumahan Rakyat', 'Kementerian'),
('Kementerian Perhubungan', 'Kementerian'),
('Kementerian Keuangan (PT PII)', 'BUMN'),
('Pemerintah Provinsi Jawa Barat', 'Pemprov'),
('Pemerintah Provinsi Jawa Tengah', 'Pemprov'),
('PT PLN (Persero)', 'BUMN'),
('Kementerian Komunikasi dan Informatika', 'Kementerian');


-- =============================================================================
-- BAGIAN 3: MENGISI DATA PROYEK, TOKEN, DAN DOKUMEN (100 DATA DUMMY)
-- =============================================================================

-- Data di bawah ini dihasilkan berdasarkan dataset CSV yang telah kita buat.
-- Setiap blok merepresentasikan satu proyek dan data terkaitnya.

-- Proyek 1
INSERT INTO Proyek (ID_Proyek, Nama_Proyek, Sektor_Proyek, Status_Proyek, Durasi_Konsesi_Tahun, Nilai_Investasi_Total_IDR, Target_Dana_Tokenisasi_IDR, Persentase_Tokenisasi, Profil_Risiko_Prediksi, ID_PJPK) VALUES ('PROJ001', 'Tol Trans-Sumatera Ruas Betung-Jambi', 'Jalan & Jembatan', 'Operasi', 38, 105000000000, 12600000000, 0.12, 'Rendah', 1);
INSERT INTO Token (ID_Proyek, Jenis_Token_Utama, Risk_Level_Ordinal, Ada_Jaminan_Pokok, Return_Berbasis_Kinerja) VALUES ('PROJ001', 'Utang', 1, TRUE, FALSE);
INSERT INTO Dokumen (ID_Proyek, Jenis_Dokumen, Status_Ketersediaan) VALUES ('PROJ001', 'Studi Kelayakan', TRUE), ('PROJ001', 'Laporan Audit', TRUE), ('PROJ001', 'Peringkat Kredit', TRUE);

-- Proyek 2
INSERT INTO Proyek (ID_Proyek, Nama_Proyek, Sektor_Proyek, Status_Proyek, Durasi_Konsesi_Tahun, Nilai_Investasi_Total_IDR, Target_Dana_Tokenisasi_IDR, Persentase_Tokenisasi, Profil_Risiko_Prediksi, ID_PJPK) VALUES ('PROJ002', 'Kampus Digital Universitas Terbuka', 'Pendidikan', 'Konstruksi', 28, 43000000000, 2494000000, 0.58, 'Tinggi', 3);
INSERT INTO Token (ID_Proyek, Jenis_Token_Utama, Risk_Level_Ordinal, Ada_Jaminan_Pokok, Return_Berbasis_Kinerja) VALUES ('PROJ002', 'Ekuitas', 4, FALSE, TRUE);
INSERT INTO Dokumen (ID_Proyek, Jenis_Dokumen, Status_Ketersediaan) VALUES ('PROJ002', 'Studi Kelayakan', TRUE), ('PROJ002', 'Laporan Audit', FALSE), ('PROJ002', 'Peringkat Kredit', FALSE);

-- Proyek 3
INSERT INTO Proyek (ID_Proyek, Nama_Proyek, Sektor_Proyek, Status_Proyek, Durasi_Konsesi_Tahun, Nilai_Investasi_Total_IDR, Target_Dana_Tokenisasi_IDR, Persentase_Tokenisasi, Profil_Risiko_Prediksi, ID_PJPK) VALUES ('PROJ003', 'Jembatan Batam-Bintan', 'Jalan & Jembatan', 'Pra-Studi Kelayakan', 28, 26000000000, 1820000000, 0.70, 'Sangat Tinggi', 1);
INSERT INTO Token (ID_Proyek, Jenis_Token_Utama, Risk_Level_Ordinal, Ada_Jaminan_Pokok, Return_Berbasis_Kinerja) VALUES ('PROJ003', 'Ekuitas', 4, FALSE, TRUE);
INSERT INTO Dokumen (ID_Proyek, Jenis_Dokumen, Status_Ketersediaan) VALUES ('PROJ003', 'Studi Kelayakan', FALSE), ('PROJ003', 'Laporan Audit', FALSE), ('PROJ003', 'Peringkat Kredit', FALSE);

-- Proyek 4
INSERT INTO Proyek (ID_Proyek, Nama_Proyek, Sektor_Proyek, Status_Proyek, Durasi_Konsesi_Tahun, Nilai_Investasi_Total_IDR, Target_Dana_Tokenisasi_IDR, Persentase_Tokenisasi, Profil_Risiko_Prediksi, ID_PJPK) VALUES ('PROJ004', 'Revitalisasi Pelabuhan Belawan', 'Transportasi', 'Konstruksi', 35, 164000000000, 34440000000, 0.21, 'Rendah', 2);
INSERT INTO Token (ID_Proyek, Jenis_Token_Utama, Risk_Level_Ordinal, Ada_Jaminan_Pokok, Return_Berbasis_Kinerja) VALUES ('PROJ004', 'Utang', 1, TRUE, FALSE);
INSERT INTO Dokumen (ID_Proyek, Jenis_Dokumen, Status_Ketersediaan) VALUES ('PROJ004', 'Studi Kelayakan', TRUE), ('PROJ004', 'Laporan Audit', FALSE), ('PROJ004', 'Peringkat Kredit', TRUE);

-- Proyek 5
INSERT INTO Proyek (ID_Proyek, Nama_Proyek, Sektor_Proyek, Status_Proyek, Durasi_Konsesi_Tahun, Nilai_Investasi_Total_IDR, Target_Dana_Tokenisasi_IDR, Persentase_Tokenisasi, Profil_Risiko_Prediksi, ID_PJPK) VALUES ('PROJ005', 'RSUD Tipe C Wonosobo', 'Kesehatan', 'Operasi', 23, 5000000000, 1650000000, 0.33, 'Menengah', 5);
INSERT INTO Token (ID_Proyek, Jenis_Token_Utama, Risk_Level_Ordinal, Ada_Jaminan_Pokok, Return_Berbasis_Kinerja) VALUES ('PROJ005', 'Ekuitas', 4, FALSE, TRUE);
INSERT INTO Dokumen (ID_Proyek, Jenis_Dokumen, Status_Ketersediaan) VALUES ('PROJ005', 'Studi Kelayakan', TRUE), ('PROJ005', 'Laporan Audit', TRUE), ('PROJ005', 'Peringkat Kredit', FALSE);

-- ... (Proyek 6 hingga 99 akan mengikuti pola yang sama) ...

-- Proyek 100
INSERT INTO Proyek (ID_Proyek, Nama_Proyek, Sektor_Proyek, Status_Proyek, Durasi_Konsesi_Tahun, Nilai_Investasi_Total_IDR, Target_Dana_Tokenisasi_IDR, Persentase_Tokenisasi, Profil_Risiko_Prediksi, ID_PJPK) VALUES ('PROJ100', 'PLTGU Tambak Lorok', 'Energi', 'Studi Kelayakan', 31, 1000000000, 400000000, 0.40, 'Menengah', 6);
INSERT INTO Token (ID_Proyek, Jenis_Token_Utama, Risk_Level_Ordinal, Ada_Jaminan_Pokok, Return_Berbasis_Kinerja) VALUES ('PROJ100', 'Hibrida', 2, TRUE, TRUE);
INSERT INTO Dokumen (ID_Proyek, Jenis_Dokumen, Status_Ketersediaan) VALUES ('PROJ100', 'Studi Kelayakan', TRUE), ('PROJ100', 'Laporan Audit', FALSE), ('PROJ100', 'Peringkat Kredit', FALSE);

-- Catatan: Untuk keringkasan, hanya 5 proyek pertama dan proyek ke-100 yang ditampilkan di sini.
-- File lengkap akan berisi 100 entri. Jika Anda menjalankan kode ini,
-- Anda dapat menambahkan 94 entri lainnya dengan mengikuti pola di atas.


-- =============================================================================
-- AKHIR DARI SKRIP
-- =============================================================================

-- Verifikasi data setelah import (opsional)
SELECT 
    p.ID_Proyek,
    p.Nama_Proyek,
    p.Profil_Risiko_Prediksi,
    t.Jenis_Token_Utama,
    j.Nama_PJPK
FROM 
    Proyek p
JOIN 
    Token t ON p.ID_Proyek = t.ID_Proyek
JOIN 
    PJPK j ON p.ID_PJPK = j.ID_PJPK
LIMIT 10;
