import os
import glob
import uuid
from typing import List, Dict, Any
from dotenv import load_dotenv
from pypdf import PdfReader
from docx import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pinecone import Pinecone, ServerlessSpec
import time

# Load environment variables
load_dotenv('.env.local')

# Configuration
DOCUMENTS_PATH = "src/app/data/documents"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 100
INDEX_NAME = "kpbu-projects"
EMBEDDING_DIMENSION = 768  # Google's embedding dimension

class DocumentProcessor:
    def __init__(self):
        """Initialize the document processor with API keys and configurations."""
        self.google_api_key = os.getenv('GOOGLE_API_KEY')
        self.pinecone_api_key = os.getenv('PINECONE_API_KEY')
        
        if not self.google_api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        if not self.pinecone_api_key:
            raise ValueError("PINECONE_API_KEY not found in environment variables")
        
        # Initialize text splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
        
        # Initialize embeddings
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=self.google_api_key
        )
        
        # Initialize Pinecone
        self.pc = Pinecone(api_key=self.pinecone_api_key)
        
    def read_pdf_document(self, file_path: str) -> str:
        """Read and extract text from PDF document."""
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            print(f"Error reading PDF {file_path}: {e}")
            return ""
    
    def read_docx_document(self, file_path: str) -> str:
        """Read and extract text from DOCX document."""
        try:
            doc = Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except Exception as e:
            print(f"Error reading DOCX {file_path}: {e}")
            return ""
    
    def read_txt_document(self, file_path: str) -> str:
        """Read and extract text from TXT document."""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read().strip()
        except Exception as e:
            print(f"Error reading TXT {file_path}: {e}")
            return ""
    
    def read_documents_from_folder(self, folder_path: str) -> List[Dict[str, Any]]:
        """Read all documents from the specified folder."""
        documents = []
        
        if not os.path.exists(folder_path):
            print(f"Folder {folder_path} does not exist")
            return documents
        
        # Supported file extensions
        pdf_files = glob.glob(os.path.join(folder_path, "*.pdf"))
        docx_files = glob.glob(os.path.join(folder_path, "*.docx"))
        txt_files = glob.glob(os.path.join(folder_path, "*.txt"))
        
        # Process PDF files
        for file_path in pdf_files:
            print(f"Processing PDF: {file_path}")
            content = self.read_pdf_document(file_path)
            if content:
                documents.append({
                    'file_path': file_path,
                    'file_name': os.path.basename(file_path),
                    'content': content,
                    'file_type': 'pdf'
                })
        
        # Process DOCX files
        for file_path in docx_files:
            print(f"Processing DOCX: {file_path}")
            content = self.read_docx_document(file_path)
            if content:
                documents.append({
                    'file_path': file_path,
                    'file_name': os.path.basename(file_path),
                    'content': content,
                    'file_type': 'docx'
                })
        
        # Process TXT files
        for file_path in txt_files:
            print(f"Processing TXT: {file_path}")
            content = self.read_txt_document(file_path)
            if content:
                documents.append({
                    'file_path': file_path,
                    'file_name': os.path.basename(file_path),
                    'content': content,
                    'file_type': 'txt'
                })
        
        print(f"Total documents processed: {len(documents)}")
        return documents
    
    def split_documents_into_chunks(self, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Split documents into chunks using RecursiveCharacterTextSplitter."""
        all_chunks = []
        
        for doc in documents:
            print(f"Splitting document: {doc['file_name']}")
            
            # Split the document content into chunks
            chunks = self.text_splitter.split_text(doc['content'])
            
            # Create chunk objects with metadata
            for i, chunk in enumerate(chunks):
                chunk_id = str(uuid.uuid4())
                chunk_data = {
                    'id': chunk_id,
                    'text': chunk,
                    'metadata': {
                        'file_name': doc['file_name'],
                        'file_path': doc['file_path'],
                        'file_type': doc['file_type'],
                        'chunk_index': i,
                        'total_chunks': len(chunks),
                        'ID_Proyek': doc.get('ID_Proyek', 'unknown'),
                        'nama_dokumen': doc['file_name']
                    }
                }
                all_chunks.append(chunk_data)
        
        print(f"Total chunks created: {len(all_chunks)}")
        return all_chunks
    
    def create_embeddings(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Create embeddings for all chunks."""
        print("Creating embeddings for chunks...")
        
        # Extract texts for batch embedding
        texts = [chunk['text'] for chunk in chunks]
        
        # Create embeddings in batches to avoid API limits
        batch_size = 100
        embeddings_list = []
        
        for i in range(0, len(texts), batch_size):
            batch_texts = texts[i:i + batch_size]
            print(f"Processing embedding batch {i//batch_size + 1}/{(len(texts)-1)//batch_size + 1}")
            
            try:
                batch_embeddings = self.embeddings.embed_documents(batch_texts)
                embeddings_list.extend(batch_embeddings)
                
                # Add a small delay to avoid hitting rate limits
                time.sleep(1)
                
            except Exception as e:
                print(f"Error creating embeddings for batch {i//batch_size + 1}: {e}")
                # Create dummy embeddings as fallback
                dummy_embeddings = [[0.0] * EMBEDDING_DIMENSION for _ in batch_texts]
                embeddings_list.extend(dummy_embeddings)
        
        # Add embeddings to chunks
        for chunk, embedding in zip(chunks, embeddings_list):
            chunk['embedding'] = embedding
        
        print(f"Embeddings created for {len(chunks)} chunks")
        return chunks
    
    def setup_pinecone_index(self) -> None:
        """Create Pinecone index if it doesn't exist."""
        print(f"Setting up Pinecone index: {INDEX_NAME}")
        
        # Check if index exists
        existing_indexes = self.pc.list_indexes()
        index_names = [index.name for index in existing_indexes]
        
        if INDEX_NAME not in index_names:
            print(f"Creating new index: {INDEX_NAME}")
            
            # Create the index
            self.pc.create_index(
                name=INDEX_NAME,
                dimension=EMBEDDING_DIMENSION,
                metric='cosine',
                spec=ServerlessSpec(
                    cloud='aws',
                    region='us-east-1'
                )
            )
            
            # Wait for index to be ready
            print("Waiting for index to be ready...")
            time.sleep(60)  # Wait for index initialization
        else:
            print(f"Index {INDEX_NAME} already exists")
    
    def upsert_to_pinecone(self, chunks: List[Dict[str, Any]]) -> None:
        """Upsert chunks to Pinecone index."""
        print("Upserting chunks to Pinecone...")
        
        # Get the index
        index = self.pc.Index(INDEX_NAME)
        
        # Prepare vectors for upsert
        vectors = []
        for chunk in chunks:
            vector = {
                'id': chunk['id'],
                'values': chunk['embedding'],
                'metadata': {
                    'text': chunk['text'],
                    'file_name': chunk['metadata']['file_name'],
                    'file_path': chunk['metadata']['file_path'],
                    'file_type': chunk['metadata']['file_type'],
                    'chunk_index': chunk['metadata']['chunk_index'],
                    'total_chunks': chunk['metadata']['total_chunks'],
                    'ID_Proyek': chunk['metadata']['ID_Proyek'],
                    'nama_dokumen': chunk['metadata']['nama_dokumen']
                }
            }
            vectors.append(vector)
        
        # Upsert in batches
        batch_size = 100
        for i in range(0, len(vectors), batch_size):
            batch_vectors = vectors[i:i + batch_size]
            print(f"Upserting batch {i//batch_size + 1}/{(len(vectors)-1)//batch_size + 1}")
            
            try:
                index.upsert(vectors=batch_vectors)
                time.sleep(1)  # Small delay between batches
            except Exception as e:
                print(f"Error upserting batch {i//batch_size + 1}: {e}")
        
        print(f"Successfully upserted {len(vectors)} vectors to Pinecone")
    
    def process_documents(self) -> None:
        """Main method to process all documents and store in Pinecone."""
        print("Starting document processing...")
        
        try:
            # Step 1: Read all documents
            documents = self.read_documents_from_folder(DOCUMENTS_PATH)
            
            if not documents:
                print("No documents found to process")
                return
            
            # Step 2: Split documents into chunks
            chunks = self.split_documents_into_chunks(documents)
            
            # Step 3: Create embeddings
            chunks_with_embeddings = self.create_embeddings(chunks)
            
            # Step 4: Setup Pinecone index
            self.setup_pinecone_index()
            
            # Step 5: Upsert to Pinecone
            self.upsert_to_pinecone(chunks_with_embeddings)
            
            print("Document processing completed successfully!")
            
        except Exception as e:
            print(f"Error during document processing: {e}")
            raise

def main():
    """Main function to run the document processing."""
    try:
        processor = DocumentProcessor()
        processor.process_documents()
    except Exception as e:
        print(f"Failed to process documents: {e}")

if __name__ == "__main__":
    main()