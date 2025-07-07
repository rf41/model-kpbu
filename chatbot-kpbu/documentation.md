# 📚 KPBU Chatbot System - Complete Documentation

## 📋 Table of Contents

1. [🎯 Overview](#-overview)
2. [🧠 Theoretical Models](#-theoretical-models)
3. [🚀 Quick Start](#-quick-start)
4. [🏗️ System Architecture](#️-system-architecture)
5. [🤖 Chat System](#-chat-system)
6. [🎯 Recommendations System](#-recommendations-system)
7. [🎨 UI Components](#-ui-components)
8. [📊 Document Processing](#-document-processing)
9. [🧪 Testing](#-testing)
10. [🔧 Configuration](#-configuration)
11. [🐛 Troubleshooting](#-troubleshooting)
12. [🔒 Security](#-security)
13. [📈 Performance](#-performance)
14. [🚀 Deployment](#-deployment)
15. [📚 API Reference](#-api-reference)
16. [🎯 Future Enhancements](#-future-enhancements)
17. [🤝 Contributing](#-contributing)
18. [📄 License](#-license)
19. [📞 Support](#-support)
20. [📊 Project Stats](#-project-stats)
21. [🎉 Getting Started Checklist](#-getting-started-checklist)

---

## 📖 Quick Summary

**KPBU Chatbot System** adalah solusi lengkap untuk manajemen dan rekomendasi proyek KPBU yang menggabungkan:

- **AI-Powered RAG**: Sistem tanya jawab cerdas menggunakan Google Gemini & Pinecone
- **Smart Recommendations**: Algoritma hybrid untuk matchmaking investor-proyek
- **Modern UI**: Interface chat responsif dengan React & Next.js
- **Document Processing**: Otomatis processing dokumen PDF, DOCX, TXT
- **Comprehensive Testing**: Suite testing lengkap untuk semua komponen

**Technologies Used:**
- **Frontend:** Next.js 15.3.5, React 18+, Tailwind CSS
- **Backend:** Node.js, Python 3.8+
- **AI/ML:** Google Gemini, Pinecone Vector Database
- **Testing:** Custom test scripts, Web interface testing
- **Deployment:** Vercel compatible, multi-platform support

---

## 🎯 Overview

Sistem chatbot KPBU (Kerjasama Pemerintah dan Badan Usaha) yang menggunakan teknologi AI untuk memberikan informasi proyek dan rekomendasi investasi. Sistem ini mengintegrasikan RAG (Retrieval-Augmented Generation), algoritma matchmaking, dan interface chat yang modern.

### 🌟 Key Features

- **🤖 AI-Powered Chat**: RAG dengan Google Gemini & Pinecone
- **🎯 Project Recommendations**: Hybrid matching algorithm (Rule-Based + Content-Based)
- **📊 Interactive UI**: Modern React chat interface dengan Next.js
- **📄 Document Processing**: Otomatis processing PDF, DOCX, TXT
- **🔍 Smart Search**: Vector search untuk informasi proyek
- **🎨 Modern Design**: Tailwind CSS dengan responsive design

---

## 🧠 Theoretical Models

### Model 1: Risk Profiling Model (Random Forest Classifier)

**Arsitektur & Mekanisme Model:**

- **Model:** Random Forest Classifier
- **Tipe:** Supervised Learning, Ensemble Classification

#### Arsitektur Ensemble:
- Model ini merupakan "hutan" (*forest*) yang terdiri dari ratusan *Decision Tree* individual
- Setiap *Decision Tree* bertindak sebagai model klasifikasi dasar yang lemah
- Kekuatan *Random Forest* berasal dari agregasi prediksi dari semua pohon

#### Mekanisme Pelatihan:
- **Bootstrap Aggregating (Bagging):** Setiap pohon dilatih dengan dataset bootstrap yang berbeda
- **Feature Randomness:** Pada setiap node, hanya sebagian fitur yang dievaluasi secara acak
- **Voting:** Hasil prediksi akhir adalah kelas dengan suara terbanyak

#### Output Kunci:
- **Prediksi Kelas:** Label risiko (Rendah, Menengah, Tinggi, Sangat Tinggi)
- **Probabilitas Prediksi:** Persentase suara untuk setiap kelas
- **Feature Importance:** Kontribusi relatif setiap fitur dalam pengambilan keputusan

#### Transformasi Dataset:
- **Rekayasa Fitur:** Membuat fitur turunan seperti Persentase_Tokenisasi
- **Fitur Ordinal:** Mengkuantifikasi informasi kualitatif (Token_Risk_Level_Ordinal)
- **One-Hot Encoding:** Untuk fitur nominal (Sektor_Proyek, Status_Proyek)
- **Label Encoding:** Untuk variabel target (Profil_Risiko)

### Model 2: Investor-Project Matchmaking Model

**Arsitektur Model Rekomendasi Proyek untuk Investor:**

Bertindak sebagai *matchmaker* cerdas antara profil risiko investor dan portofolio proyek yang tersedia.

#### Hubungan dengan Model Prediksi Risiko:
1. Proyek baru masuk ke sistem
2. **Model Prediksi Risiko** menganalisis fitur-fitur proyek dan menghasilkan label Profil_Risiko
3. Label risiko disimpan di **Database Proyek**
4. **Model Rekomendasi Investor** menggunakan label risiko sebagai kriteria dalam **Filter Keras**

#### Teknik Hibrida (Rule-Based + Content-Based):

**1. Sistem Berbasis Aturan (Rule-Based System):**
- **Konsep:** Filter "wajib" untuk menyaring proyek yang tidak relevan
- **Contoh Aturan:**
  - JIKA investor "Toleransi Risiko: Konservatif" → tampilkan hanya Profil_Risiko = 'Rendah'
  - JIKA investor "Fokus Sektor: Energi" → prioritaskan Sektor_Proyek = 'Energi'
- **Kelebihan:** Mudah diinterpretasikan, cepat, efektif untuk eliminasi awal

**2. Pemfilteran Berbasis Konten (Content-Based Filtering):**
- **Konsep:** Memberikan "skor kecocokan" untuk proyek yang tersisa
- **Mekanisme:**
  1. **Vektorisasi:** Profil investor dan proyek diubah menjadi vektor numerik
  2. **Perhitungan Kemiripan:** Menggunakan Cosine Similarity
- **Kelebihan:** Rekomendasi yang lebih personal dan bernuansa

#### Alur Kerja Implementasi:

**Tahap 1: Definisikan Profil Investor**
- **Toleransi Risiko:** Konservatif, Moderat, Agresif
- **Preferensi Sektor:** Energi, Transportasi, Kesehatan, dll.
- **Horison Investasi:** Jangka Pendek, Menengah, Panjang
- **Preferensi Jenis Token:** Utang/Hibrida, Ekuitas, Fleksibel

**Tahap 2: Mekanisme Pencocokan (Matching Engine)**
- Filter Keras menggunakan Profil_Risiko dari Model 1
- Skoring & Pemeringkatan berbasis Content-Based
- Output: Top 5 Proyek dengan Skor Tertinggi

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Google API Key (Generative AI)
- Pinecone API Key

### 1. Installation

```bash
# Clone or navigate to project
cd chatbot-kpbu

# Install Node.js dependencies
npm install

# Setup Python environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Configuration

Create `.env.local` file:
```bash
# Google AI
GOOGLE_API_KEY="your_google_api_key_here"

# Pinecone
PINECONE_API_KEY="your_pinecone_api_key_here"

# Optional Configuration
INDEX_NAME="kpbu-projects"
EMBEDDING_MODEL="models/embedding-001"
CHAT_MODEL="gemini-1.5-flash"
TOP_K=5
```

### 3. Document Processing

```bash
# Activate Python environment
source venv/bin/activate

# Add documents to src/app/data/documents/
# Then process them
python process_data.py
```

### 4. Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000` to use the system.

---

## 🏗️ System Architecture

### Frontend (Next.js + React)
```
src/
├── app/
│   ├── page.js                    # Main dashboard
│   ├── chat/page.tsx              # Full-screen chat
│   ├── recommendations/page.js    # Recommendations tester
│   └── api/
│       ├── chat/route.js          # RAG Chat API
│       └── get_recommendations/route.js  # Recommendations API
├── components/
│   ├── ChatWindow.js              # Main chat container
│   ├── MessageList.js             # Message display
│   ├── Message.js                 # Individual messages
│   ├── ChatInput.js               # Input form
│   ├── PredefinedActions.js       # Quick actions
│   ├── Navigation.js              # Navigation bar
│   └── RecommendationsTester.js   # Recommendations UI
```

### Backend (Python + APIs)
```
├── process_data.py                # Document processing
├── test-chat-api.js              # API testing
├── test-recommendations-api.js    # Recommendations testing
├── requirements.txt              # Python dependencies
└── .env.local                    # Environment variables
```

---

## 🤖 Chat System

### RAG (Retrieval-Augmented Generation) Process

1. **Document Processing**:
   - Supports PDF, DOCX, TXT files
   - Text chunking dengan RecursiveCharacterTextSplitter
   - Embedding generation menggunakan Google Embedding-001
   - Vector storage di Pinecone

2. **Query Processing**:
   - User question → embedding
   - Similarity search di Pinecone
   - Context filtering berdasarkan project ID
   - Response generation dengan Gemini-1.5-flash

3. **Response Format**:
   ```json
   {
     "success": true,
     "jawaban": "AI-generated response",
     "metadata": {
       "chunks_found": 5,
       "project_ids": ["KPBU-001"],
       "sources": [{"document": "file.pdf", "score": "0.85"}],
       "timestamp": "2025-07-07T10:00:00.000Z"
     }
   }
   ```

### Chat API Endpoints

#### POST `/api/chat`
Main chat endpoint untuk RAG queries.

**Request:**
```json
{
  "pertanyaan_user": "Apa itu KPBU?",
  "konteks_sesi": ["KPBU-001", "KPBU-002"],
  "mode": "normal" // or "faq"
}
```

**Response:**
```json
{
  "success": true,
  "jawaban": "KPBU adalah...",
  "metadata": {
    "chunks_found": 3,
    "project_ids": ["KPBU-001"],
    "sources": [...]
  }
}
```

#### GET `/api/chat`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "KPBU Chat API",
  "version": "1.0.0",
  "environment_configured": true
}
```

---

## 🎯 Recommendations System

### Hybrid Matching Algorithm

Sistem menggunakan kombinasi **Rule-Based** (60%) dan **Content-Based** (40%) matching:

#### Rule-Based Matching (60% weight)
- Sector matching (25%)
- Investment range matching (20%)
- Risk level matching (15%)
- Duration matching (10%)
- Location preference (10%)
- ROI expectation (10%)
- Government support preference (5%)
- Market demand preference (5%)

#### Content-Based Matching (40% weight)
- Tags similarity (40%)
- Description similarity (30%)
- Project characteristics similarity (30%)

### Scoring System
- Setiap proyek mendapat skor 0-100 untuk masing-masing algoritma
- Final score = (Rule-Based Score × 0.6) + (Content-Based Score × 0.4)
- Top 5 proyek dengan skor tertinggi

### Recommendations API

#### GET `/api/get_recommendations`
```
GET /api/get_recommendations?sectors=Transportation,Healthcare&investment_range=1000-10000&risk_tolerance=medium&expected_roi=10
```

#### POST `/api/get_recommendations`
```json
{
  "preferredSectors": ["Transportation", "Healthcare"],
  "investmentRange": "1000-10000",
  "riskTolerance": "medium",
  "maxDuration": 36,
  "preferredLocations": ["Jakarta", "Surabaya"],
  "expectedROI": 10,
  "governmentSupportLevel": "high",
  "marketDemandLevel": "high",
  "interests": ["infrastructure", "healthcare"],
  "keywords": ["jalan", "rumah sakit"],
  "preferredComplexity": "medium",
  "sustainabilityFocus": false,
  "technologyFocus": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": 1,
        "name": "Pembangunan Jalan Tol Jakarta-Bandung",
        "sector": "Transportation",
        "investmentRange": "5000-10000",
        "riskLevel": "medium",
        "duration": 36,
        "location": "Jakarta-Bandung",
        "description": "Proyek pembangunan jalan tol...",
        "estimatedROI": 12.5,
        "governmentSupport": "high",
        "marketDemand": "high",
        "scores": {
          "ruleBasedScore": 95.0,
          "contentBasedScore": 28.33,
          "finalScore": 68.33
        },
        "matchReasons": [
          "Sektor Transportation sesuai dengan preferensi Anda",
          "Tingkat risiko medium cocok dengan toleransi risiko Anda",
          "ROI estimasi 12.5% memenuhi ekspektasi Anda"
        ]
      }
    ],
    "total": 5,
    "algorithm": "Rule-Based & Content-Based Hybrid Matching"
  }
}
```

---

## 🎨 UI Components

### Component Architecture
```
ChatWindow.js (Main Container)
├── MessageList.js (Message Display)
│   └── Message.js (Individual Messages)
├── PredefinedActions.js (Quick Actions)
└── ChatInput.js (Input Form)
```

### Key Components

#### 1. **ChatWindow.js** - Main Chat Container
- Full-screen layout dengan flex-column dan **improved container sizing**
- State management untuk messages
- API integration untuk chat dan recommendations
- Real-time updates dan loading states
- **Enhanced scrolling** dengan proper min-height constraints

#### 2. **MessageList.js** - Message Display
- Scrollable message list dengan **improved scrolling performance**
- Auto-scroll ke message terbaru dengan requestAnimationFrame
- **Proper container sizing** untuk better scrolling behavior
- Loading indicator saat API call
- Responsive design
- **Scroll smooth** untuk better UX

#### 3. **Message.js** - Individual Message Bubble
- Dynamic styling (blue untuk user, gray untuk bot)
- **Markdown Support**: Full markdown rendering untuk bot messages
- **Enhanced Scrolling**: Improved container sizing dan scroll behavior
- Error message styling
- Source attribution
- **Markdown Features Supported**:
  - Headers (H1-H6)
  - Bold, italic, strikethrough text
  - Inline code dan code blocks
  - Ordered dan unordered lists
  - Tables dengan styling
  - Links (external)
  - Blockquotes
  - Horizontal rules
  - Custom styling untuk chat interface

#### 4. **PredefinedActions.js** - Quick Actions
- 3 main actions: "Tampilkan Proyek Saya", "Bandingkan Proyek", "Tanya Tentang Istilah KPBU"
- Quick action buttons untuk pertanyaan umum
- Responsive button grid

#### 5. **ChatInput.js** - Input Form
- Message input dengan send button
- Loading state management
- Enter key support
- Auto-resize textarea

### Action Handling

#### "Tampilkan Proyek Saya"
- Calls `/api/get_recommendations` with default preferences
- Formats hasil sebagai rich bot message
- Saves project IDs ke `konteks_sesi` state
- Shows detailed project information dengan scores

#### "Bandingkan Proyek"
- Checks if projects exist in context
- Shows comparison interface dengan project checkboxes
- Provides usage instructions
- Displays project details untuk comparison

#### "Tanya Tentang Istilah KPBU"
- Sets `currentMode` to 'faq'
- Shows FAQ mode message dengan example questions
- Mode dikirim dengan next chat message
- Auto-reset mode setelah FAQ question

---

## 📊 Document Processing

### Supported Formats
- **PDF**: Menggunakan PyPDF2
- **DOCX**: Menggunakan python-docx
- **TXT**: Direct text reading

### Processing Pipeline
1. **Document Reading**: Load dokumen dari folder
2. **Text Extraction**: Extract text berdasarkan format
3. **Text Chunking**: Split text dengan RecursiveCharacterTextSplitter
4. **Embedding Generation**: Create embeddings dengan Google Embedding-001
5. **Vector Storage**: Store embeddings di Pinecone dengan metadata

### Configuration
```python
# Chunking Configuration
CHUNK_SIZE = 1000        # Characters per chunk
CHUNK_OVERLAP = 100      # Overlap between chunks

# Pinecone Configuration
INDEX_NAME = "kpbu-projects"
EMBEDDING_DIMENSION = 768
```

### Metadata Structure
```json
{
  "text": "Document content",
  "file_name": "sample.pdf",
  "file_path": "/path/to/file",
  "file_type": "pdf",
  "chunk_index": 0,
  "total_chunks": 10,
  "ID_Proyek": "KPBU-001",
  "nama_dokumen": "Project Document"
}
```

---

## 🧪 Testing

### Automated Testing Scripts

#### 1. Chat API Testing
```bash
node test-chat-api.js
```
Tests:
- Health check endpoint
- Basic chat queries
- Project-specific queries
- Error handling

#### 2. Recommendations API Testing
```bash
node test-recommendations-api.js
```
Tests:
- GET requests dengan query parameters
- POST requests dengan JSON body
- Error handling untuk invalid data
- Scoring algorithm validation

#### 3. Action Click Testing
```bash
node test-action-click.js
```
Tests:
- "Tampilkan Proyek Saya" functionality
- "Bandingkan Proyek" interface
- "Tanya Tentang Istilah KPBU" mode
- State management

### Web Interface Testing

#### 1. Main Chat Interface
- Navigate to `http://localhost:3000`
- Test chat functionality
- Try predefined actions
- Test recommendations integration

#### 2. Dedicated Chat Page
- Navigate to `http://localhost:3000/chat`
- Full-screen chat experience
- Same functionality as main page

#### 3. Recommendations Tester
- Navigate to `http://localhost:3000/recommendations`
- Interactive recommendations testing
- Form-based preference input
- Real-time API testing

---

## 🔧 Configuration

### Environment Variables
```bash
# Required
GOOGLE_API_KEY="your_google_api_key"
PINECONE_API_KEY="your_pinecone_api_key"

# Optional (dengan defaults)
INDEX_NAME="kpbu-projects"
EMBEDDING_MODEL="models/embedding-001"
CHAT_MODEL="gemini-1.5-flash"
TOP_K=5
CHUNK_SIZE=1000
CHUNK_OVERLAP=100
```

### Model Configuration
```javascript
// Gemini Configuration
const generationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
}

// Embedding Configuration
const embeddingModel = "models/embedding-001"
```

### API Keys Setup

#### Google API Key
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project atau pilih existing project
3. Enable "Generative AI API"
4. Create API key dengan appropriate permissions
5. Copy API key ke `.env.local`

#### Pinecone API Key
1. Daftar di [Pinecone](https://pinecone.io/)
2. Create new project
3. Copy API key dari dashboard
4. Add ke `.env.local`

---

## 🐛 Troubleshooting

### Common Issues

#### 1. API Key Errors
```bash
# Check .env.local file
cat .env.local

# Verify API keys
python -c "import os; from dotenv import load_dotenv; load_dotenv('.env.local'); print('Google:', bool(os.getenv('GOOGLE_API_KEY'))); print('Pinecone:', bool(os.getenv('PINECONE_API_KEY')))"
```

#### 2. Import Errors
```bash
# Activate virtual environment
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt

# Check imports
python -c "import pinecone, google.generativeai; print('OK')"
```

#### 3. Build Errors
```bash
# Check for TypeScript errors
npm run build

# Fix common issues
npm install --legacy-peer-deps
```

#### 4. Document Processing Issues
```bash
# Test document processing
python process_data.py

# Check Pinecone connection
python -c "from pinecone import Pinecone; import os; from dotenv import load_dotenv; load_dotenv('.env.local'); pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY')); print('Indexes:', [i.name for i in pc.list_indexes()])"
```

#### 5. Scrolling Issues
```bash
# Check container heights
# Open browser dev tools and inspect ChatWindow

# Common fixes:
# 1. Ensure parent container has proper height
# 2. Check for overflow:hidden conflicts
# 3. Verify flexbox properties
```

#### 6. Markdown Rendering Issues
```bash
# Check markdown dependencies
npm list react-markdown remark-gfm @tailwindcss/typography

# Common ReactMarkdown errors:
# Error: Unexpected `className` prop
# Solution: Use wrapper div instead of className prop

# Example fix:
# Wrong: <ReactMarkdown className="prose" />
# Correct: <div className="prose"><ReactMarkdown /></div>

# Reinstall if needed
npm install react-markdown remark-gfm @tailwindcss/typography

# Test markdown rendering
node test-markdown-fix.js
```

#### 7. Performance Issues
```bash
# Check for console errors
# Open browser dev tools > Console

# Common solutions:
# 1. Reduce message history length
# 2. Implement virtual scrolling for large datasets
# 3. Optimize markdown rendering
```

#### 8. Hydration Errors
```bash
# Check for hydration errors in browser console
# Common causes:
# 1. Server/client timestamp mismatches
# 2. Browser extensions modifying DOM
# 3. Dynamic content differences

# Solutions implemented:
# 1. Move new Date().toISOString() to useEffect
# 2. Add suppressHydrationWarning to body tag
# 3. Initialize timestamps as empty strings

# Example fix:
# Wrong: timestamp: new Date().toISOString() in initial state
# Correct: timestamp: '' in initial state + useEffect to set

# Test for hydration errors
node test-hydration-fix.js
```

### Debug Commands

```bash
# Check Python environment
python -c "import sys; print(sys.executable)"

# Test API endpoints
curl -X GET http://localhost:3000/api/chat
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"pertanyaan_user": "test"}'

# Check Next.js build
npm run build
npm run start
```

---

## 🔒 Security

### Best Practices
1. **API Keys**: Never expose API keys di client-side code
2. **Environment Variables**: Use `.env.local` untuk development
3. **Input Validation**: API melakukan basic input validation
4. **Rate Limiting**: Implement rate limiting untuk production
5. **HTTPS**: Always use HTTPS di production

### Production Considerations
- Use proper secret management (AWS Secrets Manager, Azure Key Vault)
- Implement authentication dan authorization
- Add request logging dan monitoring
- Use CDN untuk static assets
- Setup proper error tracking

---

## 📈 Performance

### Optimization Strategies
1. **Caching**: Implement Redis untuk frequent queries
2. **Chunking**: Optimize chunk size untuk better retrieval
3. **Embedding**: Cache embeddings untuk repeated queries
4. **API Calls**: Batch API calls untuk bulk operations
5. **Database**: Use database untuk project data instead of in-memory

### Monitoring
- Track API response times
- Monitor embedding generation performance
- Watch Pinecone query performance
- Log user interactions untuk analytics

---

## 🚀 Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Environment Variables untuk Production
```bash
# Add to Vercel dashboard
GOOGLE_API_KEY=your_production_key
PINECONE_API_KEY=your_production_key
INDEX_NAME=kpbu-projects-prod
```

### Alternative Deployment Options
- **Netlify**: Frontend deployment
- **Railway**: Full-stack deployment
- **AWS**: EC2 atau Lambda
- **Google Cloud**: App Engine atau Cloud Run

---

## 📚 API Reference

### Chat API
| Endpoint | Method | Purpose |
|----------|---------|---------|
| `/api/chat` | GET | Health check |
| `/api/chat` | POST | RAG query |

### Recommendations API
| Endpoint | Method | Purpose |
|----------|---------|---------|
| `/api/get_recommendations` | GET | Get recommendations dengan query params |
| `/api/get_recommendations` | POST | Get recommendations dengan JSON body |

### Request/Response Examples

#### Chat Query
```javascript
// Request
{
  "pertanyaan_user": "Apa itu KPBU?",
  "konteks_sesi": ["KPBU-001"],
  "mode": "normal"
}

// Response
{
  "success": true,
  "jawaban": "KPBU adalah...",
  "metadata": {
    "chunks_found": 3,
    "project_ids": ["KPBU-001"],
    "sources": [...]
  }
}
```

#### Recommendations Query
```javascript
// Request
{
  "preferredSectors": ["Transportation"],
  "riskTolerance": "medium",
  "expectedROI": 10
}

// Response
{
  "success": true,
  "data": {
    "recommendations": [...],
    "total": 5,
    "algorithm": "Rule-Based & Content-Based Hybrid Matching"
  }
}
```

---

## 🎯 Future Enhancements

### Short Term
- [ ] User authentication dan profiles
- [ ] Conversation history
- [ ] Document upload interface
- [ ] Advanced filtering options
- [ ] Export recommendations

### Medium Term
- [ ] Machine learning untuk personalization
- [ ] Real-time notifications
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration dengan external APIs

### Long Term
- [ ] Mobile app development
- [ ] Voice interface
- [ ] Predictive analytics
- [ ] Blockchain integration
- [ ] IoT data integration

---

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

### Code Standards
- Use ESLint dan Prettier untuk code formatting
- Follow React best practices
- Add TypeScript types untuk new components
- Include tests untuk new features
- Update documentation

### Testing Requirements
- Unit tests untuk components
- Integration tests untuk API endpoints
- End-to-end tests untuk user flows
- Performance tests untuk critical paths

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Support

- **Issues**: Create GitHub issue untuk bugs atau feature requests
- **Documentation**: Refer to this documentation
- **Community**: Join discussions di GitHub Discussions
- **Email**: Contact development team

---

## 📊 Project Stats

- **Frontend**: Next.js 15.3.5, React 18+, Tailwind CSS
- **Backend**: Node.js, Python 3.8+
- **AI/ML**: Google Gemini, Pinecone Vector Database
- **Testing**: Jest, Cypress, Custom test scripts
- **Deployment**: Vercel, Railway, AWS compatible

---

## 🎉 Getting Started Checklist

- [ ] Install Node.js dan Python
- [ ] Get Google API Key
- [ ] Get Pinecone API Key
- [ ] Clone repository
- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Process documents
- [ ] Start development server
- [ ] Test chat functionality
- [ ] Test recommendations
- [ ] Deploy to production

**Happy Coding!** 🚀

---

## 🎨 Markdown Support

### Features
The chatbox now supports **full markdown rendering** for bot messages, enabling rich formatting for better user experience.

### Supported Markdown Elements

#### Text Formatting
- **Bold text** dengan `**text**`
- *Italic text* dengan `*text*`
- ~~Strikethrough~~ dengan `~~text~~`
- `Inline code` dengan backticks

#### Headers
```markdown
# H1 Header
## H2 Header  
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header
```

#### Lists
```markdown
### Ordered Lists
1. Item pertama
2. Item kedua
3. Item ketiga

### Unordered Lists
- Item satu
- Item dua
- Item tiga
```

#### Code Blocks
```markdown
### Inline Code
Gunakan `console.log()` untuk debugging

### Code Blocks
```javascript
const kpbu = {
  name: "Chatbot KPBU",
  features: ["RAG", "Recommendations", "Markdown"]
};
```
```

#### Tables
```markdown
| Kolom 1 | Kolom 2 | Kolom 3 |
|---------|---------|---------|
| Data 1  | Data 2  | Data 3  |
| Data 4  | Data 5  | Data 6  |
```

#### Links dan References
```markdown
[Link Text](https://example.com)
[Dokumentasi KPBU](https://kpbu.go.id)
```

#### Blockquotes
```markdown
> "Investasi yang bijak dimulai dengan informasi yang akurat."
> 
> — KPBU Investment Guide
```

#### Horizontal Rules
```markdown
---
```

### Implementation Details

#### Dependencies
- **react-markdown**: ^9.0.1 - Main markdown rendering
- **remark-gfm**: ^4.0.0 - GitHub Flavored Markdown support
- **@tailwindcss/typography**: ^0.5.15 - Enhanced typography styling

#### Custom Styling
All markdown elements menggunakan custom styling yang disesuaikan dengan chat interface:
- **Consistent color scheme** dengan chat theme
- **Responsive sizing** untuk different screen sizes
- **Proper spacing** untuk readability
- **Code highlighting** untuk code blocks
- **Table styling** dengan borders dan hover effects

### Usage Examples

#### Bot Response dengan Markdown
```json
{
  "success": true,
  "jawaban": "# Rekomendasi Proyek KPBU\n\n## Proyek Terpilih:\n\n### 1. **Jalan Tol Jakarta-Bandung**\n- **Investasi**: Rp 5-10 Miliar\n- **ROI**: 12%\n- **Risiko**: Medium\n\n```json\n{\n  \"project_id\": \"KPBU-001\",\n  \"status\": \"active\"\n}\n```\n\n> **Catatan**: Proyek ini memiliki prospek yang sangat baik.\n\n---\n\n**Tertarik untuk mengetahui lebih lanjut?**",
  "metadata": { ... }
}
```

#### Rendering Result
Bot message akan render dengan:
- Header styling untuk "Rekomendasi Proyek KPBU"
- List formatting untuk project details
- Code block dengan syntax highlighting
- Blockquote dengan special styling
- Horizontal rule untuk separation

### Performance Considerations
- **Lazy rendering**: Markdown hanya di-render untuk bot messages
- **Optimized components**: Custom components untuk better performance
- **Efficient re-renders**: Minimal re-rendering saat typing
