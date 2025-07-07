'use client';

import { useState, useEffect } from 'react';
import ChatWindow from '@/components/ChatWindow';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Selamat datang di KPBU Chatbot! Saya siap membantu Anda dengan pertanyaan tentang proyek KPBU. Apa yang ingin Anda ketahui?",
      isUser: false,
      timestamp: ''
    }
  ]);
  
  // Additional state for context and mode management
  const [konteksSesi, setKonteksSesi] = useState([]);
  const [currentMode, setCurrentMode] = useState('normal');

  // Set initial timestamp on client side to avoid hydration mismatch
  useEffect(() => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === 1 && msg.timestamp === '' 
          ? { ...msg, timestamp: new Date().toISOString() }
          : msg
      )
    );
  }, []);

  const handleActionClick = async (actionName) => {
    console.log('Action clicked:', actionName);

    if (actionName === 'Tampilkan Proyek Saya') {
      // Show loading message
      const loadingMessage = {
        id: Date.now(),
        text: "Sedang mencari proyek yang sesuai dengan preferensi Anda...",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, loadingMessage]);

      try {
        // Call recommendations API with default preferences
        const response = await fetch('/api/get_recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            preferredSectors: ['Transportation', 'Healthcare', 'Energy'],
            riskTolerance: 'medium',
            expectedROI: 10,
            governmentSupportLevel: 'high',
            marketDemandLevel: 'high'
          })
        });

        const data = await response.json();

        if (data.success && data.data.recommendations) {
          // Extract project IDs and save to context
          const projectIds = data.data.recommendations.map(project => project.id);
          setKonteksSesi(prev => [...prev, ...projectIds]);

          // Format recommendations as bot message
          let recommendationText = "🎯 **Berikut adalah 5 proyek KPBU yang direkomendasikan untuk Anda:**\n\n";
          
          data.data.recommendations.forEach((project, index) => {
            recommendationText += `**${index + 1}. ${project.name}**\n`;
            recommendationText += `📊 Sektor: ${project.sector}\n`;
            recommendationText += `💰 Investasi: ${project.investmentRange} Juta IDR\n`;
            recommendationText += `⚡ Risiko: ${project.riskLevel}\n`;
            recommendationText += `📈 ROI Estimasi: ${project.estimatedROI}%\n`;
            recommendationText += `📍 Lokasi: ${project.location}\n`;
            recommendationText += `⏱️ Durasi: ${project.duration} bulan\n`;
            recommendationText += `🏆 Skor: ${project.scores.finalScore}\n`;
            recommendationText += `📝 ${project.description}\n\n`;
            
            if (project.matchReasons && project.matchReasons.length > 0) {
              recommendationText += "**Alasan Rekomendasi:**\n";
              project.matchReasons.forEach(reason => {
                recommendationText += `• ${reason}\n`;
              });
              recommendationText += "\n";
            }
          });

          recommendationText += "💡 **Tip:** Anda dapat menggunakan tombol 'Bandingkan Proyek' untuk membandingkan proyek-proyek ini lebih detail!";

          // Remove loading message and add recommendation
          setMessages(prev => {
            const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
            return [...filtered, {
              id: Date.now() + 1,
              text: recommendationText,
              isUser: false,
              timestamp: new Date().toISOString(),
              metadata: { type: 'recommendations', projects: data.data.recommendations }
            }];
          });
        } else {
          // Remove loading message and show error
          setMessages(prev => {
            const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
            return [...filtered, {
              id: Date.now() + 1,
              text: "Maaf, terjadi kesalahan saat mengambil rekomendasi proyek. Silakan coba lagi nanti.",
              isUser: false,
              timestamp: new Date().toISOString(),
              isError: true
            }];
          });
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        
        // Remove loading message and show error
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
          return [...filtered, {
            id: Date.now() + 1,
            text: "Maaf, terjadi kesalahan jaringan saat mengambil rekomendasi proyek. Silakan coba lagi nanti.",
            isUser: false,
            timestamp: new Date().toISOString(),
            isError: true
          }];
        });
      }
    } 
    
    else if (actionName === 'Bandingkan Proyek') {
      if (konteksSesi.length === 0) {
        // No projects in context, ask user to get recommendations first
        const noProjectsMessage = {
          id: Date.now(),
          text: "Belum ada proyek yang tersimpan untuk dibandingkan. Silakan gunakan tombol 'Tampilkan Proyek Saya' terlebih dahulu untuk mendapatkan rekomendasi proyek.",
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, noProjectsMessage]);
      } else {
        // Show comparison interface
        let comparisonText = "🔍 **Bandingkan Proyek KPBU**\n\n";
        comparisonText += "Pilih proyek yang ingin Anda bandingkan dari daftar berikut:\n\n";
        
        // Get project details from the last recommendations
        const lastRecommendationMessage = messages.find(msg => 
          msg.metadata && msg.metadata.type === 'recommendations'
        );
        
        if (lastRecommendationMessage && lastRecommendationMessage.metadata.projects) {
          const projects = lastRecommendationMessage.metadata.projects;
          
          projects.forEach((project) => {
            comparisonText += `☐ **${project.name}**\n`;
            comparisonText += `   📊 ${project.sector} | 💰 ${project.investmentRange} Juta IDR | 📈 ROI: ${project.estimatedROI}%\n`;
            comparisonText += `   📍 ${project.location} | ⚡ Risiko: ${project.riskLevel}\n\n`;
          });
          
          comparisonText += "💬 **Cara menggunakan:**\n";
          comparisonText += "• Ketik nama proyek yang ingin Anda bandingkan\n";
          comparisonText += "• Contoh: 'Bandingkan Jalan Tol Jakarta-Bandung dengan Rumah Sakit Umum Daerah'\n";
          comparisonText += "• Atau tanya detail spesifik: 'Apa perbedaan risiko antara proyek energi dan transportasi?'\n\n";
          comparisonText += "🎯 Saya akan membantu Anda menganalisis dan membandingkan proyek-proyek tersebut!";
        } else {
          comparisonText += "Proyek tersimpan: " + konteksSesi.length + " proyek\n\n";
          comparisonText += "💬 Ketik nama proyek atau kriteria yang ingin Anda bandingkan, dan saya akan membantu Anda menganalisisnya!";
        }

        const comparisonMessage = {
          id: Date.now(),
          text: comparisonText,
          isUser: false,
          timestamp: new Date().toISOString(),
          metadata: { type: 'comparison_mode', projectIds: konteksSesi }
        };
        setMessages(prev => [...prev, comparisonMessage]);
      }
    }
    
    else if (actionName === 'Tanya Tentang Istilah KPBU') {
      // Set FAQ mode
      setCurrentMode('faq');
      
      const faqMessage = {
        id: Date.now(),
        text: "📚 **Mode FAQ - Istilah KPBU**\n\n" +
              "Saya siap membantu Anda memahami istilah-istilah dalam KPBU (Kerjasama Pemerintah dan Badan Usaha)!\n\n" +
              "🔍 **Contoh pertanyaan yang bisa Anda ajukan:**\n" +
              "• Apa itu KPBU?\n" +
              "• Bagaimana skema pembiayaan KPBU?\n" +
              "• Apa perbedaan BOT, BOO, dan BTO?\n" +
              "• Bagaimana proses tender KPBU?\n" +
              "• Apa itu VfM (Value for Money)?\n" +
              "• Bagaimana alokasi risiko dalam KPBU?\n\n" +
              "💬 Silakan tanyakan istilah atau konsep KPBU yang ingin Anda ketahui!",
        isUser: false,
        timestamp: new Date().toISOString(),
        metadata: { type: 'faq_mode' }
      };
      setMessages(prev => [...prev, faqMessage]);
    }
    
    else {
      // Handle unknown action
      const unknownActionMessage = {
        id: Date.now(),
        text: `Maaf, aksi "${actionName}" belum tersedia. Silakan pilih aksi yang lain.`,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, unknownActionMessage]);
    }
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message immediately to UI
    const userMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Make API call to chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pertanyaan_user: messageText,
          konteks_sesi: konteksSesi,
          mode: currentMode
        })
      });

      const data = await response.json();

      // Reset mode to normal after sending the message
      if (currentMode === 'faq') {
        setCurrentMode('normal');
      }

      // Add bot response to messages
      const botMessage = {
        id: Date.now() + 1,
        text: data.success 
          ? data.jawaban 
          : (data.error || 'Maaf, terjadi kesalahan saat memproses pertanyaan Anda.'),
        isUser: false,
        timestamp: new Date().toISOString(),
        metadata: data.metadata || null,
        isError: !data.success
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Maaf, terjadi kesalahan jaringan. Silakan coba lagi.',
        isUser: false,
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="h-screen">
      <ChatWindow 
        messages={messages}
        onSendMessage={handleSendMessage}
        onActionClick={handleActionClick}
        onClearChat={() => {
          setMessages([{
            id: 1,
            text: "Chat telah dibersihkan. Silakan mulai percakapan baru!",
            isUser: false,
            timestamp: new Date().toISOString()
          }]);
          setKonteksSesi([]);
          setCurrentMode('normal');
        }}
      />
    </div>
  );
}
