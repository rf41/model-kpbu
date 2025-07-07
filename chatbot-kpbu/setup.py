#!/usr/bin/env python3
"""
Setup script untuk process_data.py
"""

import os
import subprocess
import sys

def check_python_version():
    """Cek versi Python"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 atau lebih baru diperlukan")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    return True

def create_virtual_environment():
    """Buat virtual environment jika belum ada"""
    if not os.path.exists('venv'):
        print("📦 Membuat virtual environment...")
        subprocess.run([sys.executable, '-m', 'venv', 'venv'], check=True)
        print("✅ Virtual environment dibuat")
    else:
        print("✅ Virtual environment sudah ada")

def install_requirements():
    """Install requirements"""
    print("📦 Menginstall dependencies...")
    
    # Determine the python executable path
    if os.name == 'nt':  # Windows
        python_path = os.path.join('venv', 'Scripts', 'python.exe')
        pip_path = os.path.join('venv', 'Scripts', 'pip.exe')
    else:  # Unix-like systems
        python_path = os.path.join('venv', 'bin', 'python')
        pip_path = os.path.join('venv', 'bin', 'pip')
    
    # Install requirements
    subprocess.run([pip_path, 'install', '-r', 'requirements.txt'], check=True)
    print("✅ Dependencies terinstall")

def create_env_file():
    """Buat file .env.local jika belum ada"""
    if not os.path.exists('.env.local'):
        print("📝 Membuat file .env.local...")
        with open('.env.local', 'w') as f:
            f.write("""# Kunci API dari masing-masing platform
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
PINECONE_API_KEY="YOUR_PINECONE_API_KEY"
""")
        print("✅ File .env.local dibuat")
        print("⚠️  Silakan edit .env.local dan masukkan API keys Anda")
    else:
        print("✅ File .env.local sudah ada")

def create_documents_folder():
    """Buat folder documents jika belum ada"""
    docs_path = "src/app/data/documents"
    if not os.path.exists(docs_path):
        print("📁 Membuat folder documents...")
        os.makedirs(docs_path, exist_ok=True)
        print("✅ Folder documents dibuat")
    else:
        print("✅ Folder documents sudah ada")

def main():
    """Setup utama"""
    print("🔧 Setup process_data.py")
    print("=" * 30)
    
    try:
        # Cek Python version
        if not check_python_version():
            return
        
        # Buat virtual environment
        create_virtual_environment()
        
        # Install requirements
        install_requirements()
        
        # Buat file .env.local
        create_env_file()
        
        # Buat folder documents
        create_documents_folder()
        
        print("\n✅ Setup selesai!")
        print("\n📋 Langkah selanjutnya:")
        print("1. Edit file .env.local dan masukkan API keys:")
        print("   - GOOGLE_API_KEY: Dapatkan dari Google Cloud Console")
        print("   - PINECONE_API_KEY: Dapatkan dari Pinecone dashboard")
        print("2. Masukkan dokumen (PDF, DOCX, TXT) ke folder src/app/data/documents/")
        print("3. Jalankan: python process_data.py")
        
    except Exception as e:
        print(f"❌ Error during setup: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
