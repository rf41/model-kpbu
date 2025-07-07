import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration constants
const INDEX_NAME = 'kpbu-projects';
const EMBEDDING_MODEL = 'models/embedding-001';
const CHAT_MODEL = 'gemini-1.5-flash';
const TOP_K = 5;

// Initialize clients
let pineconeClient = null;
let genAI = null;

function initializeClients() {
  if (!pineconeClient) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY not found in environment variables');
    }
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }

  if (!genAI) {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY not found in environment variables');
    }
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }

  return { pineconeClient, genAI };
}

async function createEmbedding(text) {
  try {
    const { genAI } = initializeClients();
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw new Error('Failed to create embedding');
  }
}

async function searchRelevantChunks(queryEmbedding, projectIds = []) {
  try {
    const { pineconeClient } = initializeClients();
    const index = pineconeClient.index(INDEX_NAME);

    // Build filter for project IDs
    let filter = {};
    if (projectIds && projectIds.length > 0) {
      filter = {
        ID_Proyek: {
          $in: projectIds
        }
      };
    }

    const queryRequest = {
      vector: queryEmbedding,
      topK: TOP_K,
      includeMetadata: true,
      filter: filter
    };

    const searchResults = await index.query(queryRequest);
    
    return searchResults.matches || [];
  } catch (error) {
    console.error('Error searching Pinecone:', error);
    throw new Error('Failed to search relevant chunks');
  }
}

function buildRAGPrompt(userQuestion, relevantChunks) {
  const context = relevantChunks
    .map((chunk, index) => {
      const metadata = chunk.metadata || {};
      return `
[Dokumen ${index + 1}]
Sumber: ${metadata.nama_dokumen || 'Unknown'}
ID Proyek: ${metadata.ID_Proyek || 'Unknown'}
Konten: ${metadata.text || ''}
Skor Relevansi: ${chunk.score?.toFixed(4) || 'N/A'}
---`;
    })
    .join('\n');

  return `
Anda adalah asisten AI yang ahli dalam proyek Kerjasama Pemerintah dan Badan Usaha (KPBU). 
Berdasarkan dokumen-dokumen yang relevan di bawah ini, berikan jawaban yang akurat dan komprehensif untuk pertanyaan pengguna.

KONTEKS DOKUMEN:
${context}

PERTANYAAN PENGGUNA: ${userQuestion}

INSTRUKSI JAWABAN:
1. Berikan jawaban yang berdasarkan pada dokumen yang disediakan
2. Jika informasi tidak tersedia dalam dokumen, nyatakan dengan jelas
3. Sertakan referensi ke dokumen yang relevan jika memungkinkan
4. Gunakan bahasa Indonesia yang profesional dan mudah dipahami
5. Struktur jawaban dengan jelas menggunakan poin-poin jika diperlukan

JAWABAN:`;
}

async function generateResponse(prompt) {
  try {
    const { genAI } = initializeClients();
    const model = genAI.getGenerativeModel({ 
      model: CHAT_MODEL,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response');
  }
}

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { pertanyaan_user, konteks_sesi } = body;

    // Validate required fields
    if (!pertanyaan_user || typeof pertanyaan_user !== 'string') {
      return NextResponse.json(
        { 
          error: 'pertanyaan_user is required and must be a string',
          success: false 
        }, 
        { status: 400 }
      );
    }

    // Extract project IDs from context
    const projectIds = konteks_sesi?.map(item => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item.ID_Proyek) return item.ID_Proyek;
      return null;
    }).filter(Boolean) || [];

    console.log('Processing chat request:', {
      question: pertanyaan_user,
      projectIds: projectIds,
      timestamp: new Date().toISOString()
    });

    // Step 1: Create embedding for user question
    console.log('Creating embedding for user question...');
    const questionEmbedding = await createEmbedding(pertanyaan_user);

    // Step 2: Search relevant chunks in Pinecone
    console.log('Searching relevant chunks...');
    const relevantChunks = await searchRelevantChunks(questionEmbedding, projectIds);

    if (relevantChunks.length === 0) {
      return NextResponse.json({
        success: true,
        jawaban: "Maaf, saya tidak dapat menemukan informasi yang relevan untuk pertanyaan Anda dalam dokumen yang tersedia.",
        metadata: {
          chunks_found: 0,
          project_ids: projectIds,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Step 3: Build RAG prompt
    console.log('Building RAG prompt...');
    const ragPrompt = buildRAGPrompt(pertanyaan_user, relevantChunks);

    // Step 4: Generate response using Gemini
    console.log('Generating response...');
    const generatedResponse = await generateResponse(ragPrompt);

    // Step 5: Prepare response metadata
    const responseMetadata = {
      chunks_found: relevantChunks.length,
      project_ids: projectIds,
      sources: relevantChunks.map(chunk => ({
        document: chunk.metadata?.nama_dokumen || 'Unknown',
        project_id: chunk.metadata?.ID_Proyek || 'Unknown',
        score: chunk.score?.toFixed(4) || 'N/A'
      })),
      timestamp: new Date().toISOString()
    };

    // Step 6: Return successful response
    return NextResponse.json({
      success: true,
      jawaban: generatedResponse,
      metadata: responseMetadata
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        success: false,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

// Optional: Add GET method for health check
export async function GET() {
  try {
    // Check if environment variables are set
    const hasApiKeys = !!(process.env.PINECONE_API_KEY && process.env.GOOGLE_API_KEY);
    
    return NextResponse.json({
      status: 'healthy',
      service: 'KPBU Chat API',
      version: '1.0.0',
      environment_configured: hasApiKeys,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}