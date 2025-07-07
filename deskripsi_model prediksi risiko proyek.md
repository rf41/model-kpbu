### **Slide 1: Arsitektur & Mekanisme Model**

**Model:** Random Forest Classifier

**Tipe:** Supervised Learning, Ensemble Classification

* **Arsitektur Ensemble:**  
  * Model ini bukan merupakan satu entitas tunggal, melainkan sebuah "hutan" (*forest*) yang terdiri dari ratusan *Decision Tree* (pohon keputusan) individual.  
  * Setiap *Decision Tree* bertindak sebagai model klasifikasi dasar yang lemah.  
  * Kekuatan *Random Forest* berasal dari agregasi prediksi dari semua pohon untuk menghasilkan satu keputusan final yang lebih kuat dan stabil.  
* **Mekanisme Pelatihan (Mengurangi Overfitting & Bias):**  
  * **Bootstrap Aggregating (Bagging):** Untuk setiap pohon yang akan dibangun, dibuat sebuah dataset *bootstrap* dengan mengambil sampel acak dari data latihan asli (dengan penggantian). Ini memastikan setiap pohon "melihat" data dari perspektif yang sedikit berbeda, sehingga meningkatkan keberagaman.  
  * **Feature Randomness (Random Subspace):** Pada setiap *node* (titik keputusan) di dalam sebuah pohon, model tidak mengevaluasi semua fitur yang ada. Sebaliknya, ia hanya memilih sebagian kecil fitur secara acak untuk menentukan *split* terbaik. Ini mencegah pohon-pohon menjadi terlalu mirip satu sama lain karena didominasi oleh fitur yang sama.  
* **Mekanisme Prediksi:**  
  * **Voting:** Ketika data proyek baru dimasukkan, data tersebut akan dilewatkan ke setiap pohon di dalam hutan.  
  * Setiap pohon secara independen memberikan "suara" (vote) untuk satu kelas risiko (Rendah, Menengah, Tinggi, Sangat Tinggi).  
  * **Keputusan Mayoritas:** Hasil prediksi akhir adalah kelas yang menerima suara terbanyak dari seluruh pohon.  
* **Output Kunci:**  
  * **Prediksi Kelas:** Label risiko dengan suara terbanyak.  
  * **Probabilitas Prediksi:** Persentase suara untuk setiap kelas, menunjukkan tingkat keyakinan model.  
  * **Feature Importance:** Kemampuan untuk mengukur kontribusi relatif setiap fitur dalam proses pengambilan keputusan, krusial untuk interpretasi.

### **Slide 2: Arsitektur & Transformasi Dataset**

**Sumber Data:** Kuesioner Proyek KPBU & Karakteristik Model Token.

**Tujuan Transformasi:** Mengubah data mentah (kualitatif, teks) menjadi matriks fitur numerik yang dapat diinterpretasikan oleh algoritma *machine learning*.

* **Rekayasa Fitur (*Feature Engineering*):**  
  * **Fitur Turunan (Rasio):** Membuat fitur baru yang lebih informatif.  
    * *Contoh:* Persentase\_Tokenisasi \= (Target\_Dana\_Tokenisasi\_IDR / Nilai\_Investasi\_Total\_IDR).  
  * **Fitur Ordinal (Berbasis Pengetahuan Domain):** Mengkuantifikasi informasi kualitatif menjadi skala berurutan.  
    * *Contoh:* Token\_Risk\_Level\_Ordinal memetakan jenis token (Utang, Hibrida, Ekuitas) ke skala risiko numerik (1, 2, 4).  
* **Encoding Variabel Kategorikal:**  
  * **One-Hot Encoding (untuk Fitur Nominal):**  
    * Diterapkan pada fitur tanpa urutan intrinsik seperti Sektor\_Proyek dan Status\_Proyek.  
    * Mengubah satu kolom (misal: Status\_Proyek) menjadi beberapa kolom biner baru (misal: Status\_Proyek\_Konstruksi, Status\_Proyek\_Operasi).  
    * Tujuannya adalah untuk mencegah model membuat asumsi matematis yang salah (misal: Operasi \> Konstruksi).  
  * **Label Encoding (untuk Variabel Target):**  
    * Diterapkan pada kolom target Profil\_Risiko.  
    * Mengubah label teks ('Rendah', 'Menengah', 'Tinggi') menjadi representasi integer (0, 1, 2\) agar dapat diproses oleh model. Hasil prediksi integer ini kemudian dipetakan kembali ke label teks aslinya.  
* **Struktur Dataset Final:**  
  * Sebuah matriks 2D di mana:  
    * **Baris** merepresentasikan setiap ID\_Proyek unik.  
    * **Kolom** merepresentasikan semua fitur numerik, biner, dan hasil *encoding*, yang siap digunakan untuk melatih dan menguji model.