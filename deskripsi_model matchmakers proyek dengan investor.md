### **Arsitektur Model Rekomendasi Proyek untuk Investor**

Tujuan dari model kedua ini adalah untuk bertindak sebagai *matchmaker* cerdas antara profil risiko investor dan portofolio proyek yang tersedia.

### **Hubungan dengan Model Prediksi Risiko**

Sistem rekomendasi ini tidak berdiri sendiri. Ia secara fundamental bergantung pada output dari **Model Prediksi Risiko Proyek** yang telah kita buat sebelumnya.

* **Input Kritis:** Atribut Profil\_Risiko ('Rendah', 'Menengah', 'Tinggi', 'Sangat Tinggi') untuk setiap proyek di dalam database **bukanlah data statis**. Nilai ini dihasilkan secara dinamis oleh model prediksi risiko pertama.  
* **Alur Kerja Terintegrasi:**  
  1. Sebuah proyek baru masuk ke sistem.  
  2. **Model Prediksi Risiko** menganalisis fitur-fitur proyek tersebut dan menghasilkan label Profil\_Risiko.  
  3. Label risiko ini kemudian disimpan atau diperbarui di dalam **Database Proyek**.  
  4. **Model Rekomendasi Investor** menggunakan label risiko yang sudah ada di database ini sebagai salah satu kriteria utama dalam tahap **Filter Keras (Rule-Based)** untuk mencocokkan proyek dengan toleransi risiko investor.

Dengan demikian, kedua model bekerja secara berurutan untuk memastikan bahwa rekomendasi yang diberikan kepada investor tidak hanya cocok dari segi preferensi (sektor, horison), tetapi juga sudah sesuai dengan tingkat risiko yang dapat diterima.

### **Teknik yang Direkomendasikan: Sistem Hibrida (Rule-Based \+ Content-Based)**

Pendekatan ini adalah yang paling efektif karena menggabungkan logika bisnis yang jelas dengan kemampuan pencocokan pola.

1. **Sistem Berbasis Aturan (*Rule-Based System*):**  
   * **Konsep:** Bekerja seperti serangkaian filter "wajib". Ini adalah langkah pertama untuk menyaring proyek-proyek yang sama sekali tidak relevan.  
   * **Contoh Aturan:**  
     * JIKA investor memilih "Toleransi Risiko: Konservatif", MAKA hanya tampilkan proyek dengan Profil\_Risiko \= 'Rendah'.  
     * JIKA investor memilih "Fokus Sektor: Energi", MAKA prioritaskan proyek dengan Sektor\_Proyek \= 'Energi'.  
   * **Kelebihan:** Sangat mudah diinterpretasikan, cepat, dan efektif untuk eliminasi awal.  
2. **Pemfilteran Berbasis Konten (*Content-Based Filtering*):**  
   * **Konsep:** Setelah penyaringan awal, teknik ini akan memberikan "skor kecocokan" untuk setiap proyek yang tersisa. Ia bekerja dengan cara membandingkan "konten" atau atribut dari profil investor dengan atribut dari setiap profil proyek.  
   * **Mekanisme:**  
     1. **Vektorisasi:** Baik profil investor maupun profil proyek diubah menjadi vektor numerik.  
     2. **Perhitungan Kemiripan:** Mengukur seberapa "mirip" vektor investor dengan setiap vektor proyek. Metrik yang paling umum digunakan adalah **Cosine Similarity**. Semakin tinggi skor kemiripannya (mendekati 1.0), semakin cocok proyek tersebut.  
   * **Kelebihan:** Mampu menemukan rekomendasi yang lebih personal dan bernuansa, bahkan jika tidak cocok 100% berdasarkan aturan keras.

### **Arsitektur & Alur Kerja Implementasi**

Berikut adalah langkah-langkah implementasi dari sistem rekomendasi ini:

**Tahap 1: Definisikan Profil Investor (Melalui Kuesioner)**

Buat kuesioner singkat untuk menangkap preferensi inti investor.

* **Toleransi Risiko:** (Pilihan: Konservatif, Moderat, Agresif)  
* **Preferensi Sektor:** (Pilihan Ganda: Energi, Transportasi, Kesehatan, dll. atau "Semua Sektor")  
* **Horison Investasi:** (Pilihan: Jangka Pendek (1-5 tahun), Jangka Menengah (5-15 tahun), Jangka Panjang (\>15 tahun))  
* **Preferensi Jenis Token:** (Pilihan: Fokus Pendapatan Tetap (Utang/Hibrida), Fokus Pertumbuhan (Ekuitas), Fleksibel)

**Tahap 2: Mekanisme Pencocokan (*Matching Engine*)**

Ini adalah inti dari model, yang menggabungkan kedua teknik.

1. **Filter Keras (Rule-Based):**  
   * Ambil input dari kuesioner investor.  
   * Filter seluruh database proyek berdasarkan aturan yang tidak bisa ditawar. Contoh: Jika investor memilih "Konservatif", maka semua proyek dengan Profil\_Risiko 'Menengah', 'Tinggi', dan 'Sangat Tinggi' akan langsung dieliminasi.  
2. **Skoring & Pemeringkatan (Content-Based):**  
   * Untuk setiap proyek yang lolos dari filter, hitung **Skor Kecocokan Total**.  
   * Buat fungsi skoring sederhana. Contoh:  
     * **Skor Kecocokan Sektor:** Jika sektor proyek ada dalam preferensi investor, skor \= 1, jika tidak \= 0\.  
     * **Skor Kecocokan Horison:** Jika Durasi\_Konsesi\_Tahun proyek cocok dengan horison investasi investor, skor \= 1, jika tidak \= 0.5 (masih bisa ditoleransi).  
     * **Skor Kecocokan Token:** Jika Jenis\_Token\_Utama cocok dengan preferensi investor, skor \= 1, jika tidak \= 0\.  
   * Skor Total (dengan Pembobotan):  
     Skor Akhir \= (Bobot\_Sektor \* Skor\_Sektor) \+ (Bobot\_Horison \* Skor\_Horison) \+ (Bobot\_Token \* Skor\_Token)  
     (Anda bisa menentukan bobot berdasarkan apa yang paling penting, misal Bobot\_Horison lebih tinggi dari Bobot\_Sektor)

**Tahap 3: Output Rekomendasi**

* Urutkan proyek yang telah diberi skor dari yang tertinggi hingga terendah.  
* Ambil **Top 5 proyek** dengan skor tertinggi sebagai hasil rekomendasi akhir.

### **Ilustrasi Alur Kerja (Untuk Draw.io)**

Berikut adalah kode XML yang telah diperbaiki dan diperbarui untuk mengimpor diagram alur kerja ini ke Draw.io.

\<mxfile host="app.diagrams.net" modified="2025-07-06T15:45:00.000Z" agent="5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36" etag="nO9pQ1rS2tU3vW4x" version="24.4.9" type="device"\>  
  \<diagram name="Alur Rekomendasi Investor" id="hIjKlMnOpQrStUvWxY"\>  
    \<mxGraphModel dx="1434" dy="786" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="1100" math="0" shadow="0"\>  
      \<root\>  
        \<mxCell id="0" /\>  
        \<mxCell id="1" parent="0" /\>  
        \<mxCell id="title" value="Alur Kerja Model Rekomendasi Proyek untuk Investor" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=20;fontStyle=1" vertex="1" parent="1"\>  
          \<mxGeometry x="440" y="20" width="520" height="30" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="step1-box" value="" style="rounded=1;whiteSpace=wrap;html=1;fillColor=\#f5f5f5;strokeColor=\#666666;dashed=1;" vertex="1" parent="1"\>  
          \<mxGeometry x="40" y="80" width="360" height="240" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="step1-title" value="LANGKAH 1: INPUT PROFIL INVESTOR" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=14;fontStyle=1;" vertex="1" parent="1"\>  
          \<mxGeometry x="50" y="90" width="340" height="30" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="questionnaire" value="\<b\>Kuesioner Investor\</b\>\<br\>\<ul\>\<li\>Toleransi Risiko: \<b\>Moderat\</b\>\</li\>\<li\>Preferensi Sektor: \<b\>Energi, Transportasi\</b\>\</li\>\<li\>Horison Investasi: \<b\>Jangka Panjang (\>15 thn)\</b\>\</li\>\</ul\>" style="shape=document;whiteSpace=wrap;html=1;boundedLbl=1;fillColor=\#dae8fc;strokeColor=\#6c8ebf;align=left;verticalAlign=top;spacingLeft=10;spacingTop=10;" vertex="1" parent="1"\>  
          \<mxGeometry x="80" y="140" width="280" height="160" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="step2-box" value="" style="rounded=1;whiteSpace=wrap;html=1;fillColor=\#f5f5f5;strokeColor=\#666666;dashed=1;" vertex="1" parent="1"\>  
          \<mxGeometry x="440" y="80" width="520" height="640" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="step2-title" value="LANGKAH 2: MATCHING ENGINE" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=14;fontStyle=1;" vertex="1" parent="1"\>  
          \<mxGeometry x="450" y="90" width="500" height="30" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="risk-prediction-model" value="Model 1: Prediksi Profil Risiko\<br\>(Random Forest)" style="shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;fillColor=\#f8cecc;strokeColor=\#b85450;" vertex="1" parent="1"\>  
          \<mxGeometry x="480" y="140" width="140" height="140" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="db-proyek" value="Database Proyek\<br\>(Diperkaya dengan Profil Risiko)" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=\#e1d5e7;strokeColor=\#9673a6;" vertex="1" parent="1"\>  
          \<mxGeometry x="780" y="140" width="140" height="140" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="arrow-model-db" value="Menghasilkan \`Profil\_Risiko\`" style="endArrow=classic;html=1;rounded=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;" edge="1" parent="1" source="risk-prediction-model" target="db-proyek"\>  
          \<mxGeometry width="50" height="50" relative="1" as="geometry"\>  
            \<mxPoint x="630" y="210" as="sourcePoint" /\>  
            \<mxPoint x="770" y="210" as="targetPoint" /\>  
          \</mxGeometry\>  
        \</mxCell\>  
        \<mxCell id="filter-funnel" value="" style="shape=funnel;whiteSpace=wrap;html=1;boundedLbl=1;direction=south;fillColor=\#fff2cc;strokeColor=\#d6b656;" vertex="1" parent="1"\>  
          \<mxGeometry x="660" y="340" width="100" height="120" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="filter-text" value="\<b\>Filter Keras (Rule-Based)\</b\>\<br\>Gunakan \`Profil\_Risiko\` dari Model 1 untuk menyaring proyek yang tidak sesuai toleransi investor." style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;" vertex="1" parent="1"\>  
          \<mxGeometry x="480" y="375" width="160" height="80" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="arrow-db-filter" value="" style="endArrow=classic;html=1;rounded=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;" edge="1" parent="1" source="db-proyek" target="filter-funnel"\>  
          \<mxGeometry width="50" height="50" relative="1" as="geometry"\>  
            \<mxPoint x="850" y="300" as="sourcePoint" /\>  
            \<mxPoint x="710" y="340" as="targetPoint" /\>  
          \</mxGeometry\>  
        \</mxCell\>  
        \<mxCell id="arrow-investor-filter" value="Profil Investor" style="endArrow=classic;html=1;rounded=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;" edge="1" parent="1" source="questionnaire" target="filter-text"\>  
          \<mxGeometry width="50" height="50" relative="1" as="geometry"\>  
            \<mxPoint x="410" y="220" as="sourcePoint" /\>  
            \<mxPoint x="470" y="400" as="targetPoint" /\>  
          \</mxGeometry\>  
        \</mxCell\>  
        \<mxCell id="arrow-funnel-scoring" value="Proyek yang Lolos Filter" style="endArrow=classic;html=1;rounded=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;" edge="1" parent="1" source="filter-funnel"\>  
          \<mxGeometry width="50" height="50" relative="1" as="geometry"\>  
            \<mxPoint x="710" y="480" as="sourcePoint" /\>  
            \<mxPoint x="710" y="500" as="targetPoint" /\>  
          \</mxGeometry\>  
        \</mxCell\>  
        \<mxCell id="scoring" value="\<b\>Skoring \&amp; Pemeringkatan (Content-Based)\</b\>\<br\>Hitung Skor Kecocokan untuk setiap proyek yang lolos berdasarkan preferensi Sektor dan Horison." style="rounded=1;whiteSpace=wrap;html=1;fillColor=\#dae8fc;strokeColor=\#6c8ebf;" vertex="1" parent="1"\>  
          \<mxGeometry x="550" y="500" width="320" height="120" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="arrow-scoring-output" value="" style="endArrow=classic;html=1;rounded=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;" edge="1" parent="1" source="scoring"\>  
          \<mxGeometry width="50" height="50" relative="1" as="geometry"\>  
            \<mxPoint x="710" y="640" as="sourcePoint" /\>  
            \<mxPoint x="710" y="660" as="targetPoint" /\>  
          \</mxGeometry\>  
        \</mxCell\>  
        \<mxCell id="step3-box" value="" style="rounded=1;whiteSpace=wrap;html=1;fillColor=\#f5f5f5;strokeColor=\#666666;dashed=1;" vertex="1" parent="1"\>  
          \<mxGeometry x="1000" y="80" width="360" height="360" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="step3-title" value="LANGKAH 3: OUTPUT REKOMENDASI" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=14;fontStyle=1;" vertex="1" parent="1"\>  
          \<mxGeometry x="1010" y="90" width="340" height="30" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="top5" value="\<b\>Top 5 Proyek dengan Skor Tertinggi\</b\>" style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=1;fontStyle=1;align=center;resizeLast=1;fillColor=\#d5e8d4;strokeColor=\#82b366;" vertex="1" parent="1"\>  
          \<mxGeometry x="1040" y="140" width="280" height="280" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="row1" value="1. PLTS Terapung Cirata (Skor: 0.95)" style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;fontStyle=0;align=left;spacingLeft=10;" vertex="1" parent="top5"\>  
          \<mxGeometry y="30" width="280" height="50" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="row2" value="2. Tol Akses Pelabuhan Patimban (Skor: 0.92)" style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;fontStyle=0;align=left;spacingLeft=10;" vertex="1" parent="top5"\>  
          \<mxGeometry y="80" width="280" height="50" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="row3" value="3. LRT Bali Fase 1 (Skor: 0.88)" style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;fontStyle=0;align=left;spacingLeft=10;" vertex="1" parent="top5"\>  
          \<mxGeometry y="130" width="280" height="50" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="row4" value="4. PLTGU Muara Karang (Skor: 0.85)" style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;fontStyle=0;align=left;spacingLeft=10;" vertex="1" parent="top5"\>  
          \<mxGeometry y="180" width="280" height="50" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="row5" value="5. Bandara Dhoho Kediri (Skor: 0.81)" style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;fontStyle=0;align=left;spacingLeft=10;" vertex="1" parent="top5"\>  
          \<mxGeometry y="230" width="280" height="50" as="geometry" /\>  
        \</mxCell\>  
        \<mxCell id="arrow-final" value="" style="endArrow=classic;html=1;rounded=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;" edge="1" parent="1" source="scoring" target="step3-box"\>  
          \<mxGeometry width="50" height="50" relative="1" as="geometry"\>  
            \<mxPoint x="880" y="560" as="sourcePoint" /\>  
            \<mxPoint x="990" y="260" as="targetPoint" /\>  
          \</mxGeometry\>  
        \</mxCell\>  
      \</root\>  
    \</mxGraphModel\>  
  \</diagram\>  
\</mxfile\>  
