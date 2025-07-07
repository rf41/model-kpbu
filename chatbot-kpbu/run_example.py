#!/usr/bin/env python3
"""
Contoh penggunaan process_data.py

Script ini menunjukkan cara menggunakan DocumentProcessor untuk memproses dokumen
dan menyimpannya ke Pinecone.
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

def main():
    """Contoh penggunaan DocumentProcessor"""
    
    print("📋 Contoh Penggunaan DocumentProcessor")
    print("=" * 50)
    
    # Cek apakah API keys sudah diatur
    google_key = os.getenv('GOOGLE_API_KEY')
    pinecone_key = os.getenv('PINECONE_API_KEY')
    
    if not google_key or not pinecone_key:
        print("❌ API keys belum diatur!")
        print("\nUntuk menjalankan script ini, pastikan Anda sudah:")
        print("1. Membuat file .env.local dengan:")
        print("   GOOGLE_API_KEY=your_google_api_key_here")
        print("   PINECONE_API_KEY=your_pinecone_api_key_here")
        print("\n2. Mendapatkan API keys dari:")
        print("   - Google: https://console.cloud.google.com/")
        print("   - Pinecone: https://pinecone.io/")
        return
    
    print("✅ API keys ditemukan!")
    
    # Cek apakah ada dokumen untuk diproses
    documents_path = "src/app/data/documents"
    if not os.path.exists(documents_path):
        print(f"❌ Folder {documents_path} tidak ditemukan!")
        return
    
    files = os.listdir(documents_path)
    if not files:
        print(f"❌ Tidak ada file dalam folder {documents_path}")
        print("Silakan tambahkan file PDF, DOCX, atau TXT ke folder tersebut.")
        return
    
    print(f"✅ Ditemukan {len(files)} file untuk diproses:")
    for file in files:
        print(f"   - {file}")
    
    # Import dan jalankan DocumentProcessor
    try:
        from process_data import DocumentProcessor
        
        print("\n🚀 Memulai proses...")
        processor = DocumentProcessor()
        
        # Proses semua dokumen
        processor.process_documents()
        
        print("\n✅ Proses selesai!")
        print("\nDokumen telah berhasil diproses dan disimpan ke Pinecone.")
        print("Anda sekarang dapat menggunakan index 'kpbu-projects' untuk pencarian.")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nPastikan:")
        print("1. API keys sudah benar")
        print("2. Koneksi internet tersedia")
        print("3. Quota API tidak terlampaui")

if __name__ == "__main__":
    main()
