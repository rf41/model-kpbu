'use client';

export default function PredefinedActions({ onActionClick }) {
  const actions = [
    {
      id: 1,
      text: 'Tampilkan Proyek Saya',
      icon: '📊',
      description: 'Lihat daftar proyek KPBU yang tersedia'
    },
    {
      id: 2,
      text: 'Bandingkan Proyek',
      icon: '⚖️',
      description: 'Bandingkan risiko dan potensi antar proyek'
    },
    {
      id: 3,
      text: 'Tanya Tentang Istilah KPBU',
      icon: '❓',
      description: 'Pelajari terminologi dan konsep KPBU'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Aksi Cepat:</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick(action.text)}
            className="
              flex items-center space-x-2 px-3 py-2 
              bg-white border border-gray-200 rounded-lg
              hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-all duration-200
              text-sm text-gray-700
              group
            "
            title={action.description}
          >
            <span className="text-base">{action.icon}</span>
            <span className="font-medium">{action.text}</span>
          </button>
        ))}
      </div>
      
      {/* Additional quick actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onActionClick('Apa itu KPBU?')}
          className="
            px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded-full
            hover:bg-blue-100 transition-colors
          "
        >
          Apa itu KPBU?
        </button>
        <button
          onClick={() => onActionClick('Bagaimana cara investasi KPBU?')}
          className="
            px-2 py-1 text-xs text-green-600 bg-green-50 rounded-full
            hover:bg-green-100 transition-colors
          "
        >
          Cara Investasi
        </button>
        <button
          onClick={() => onActionClick('Apa saja risiko proyek KPBU?')}
          className="
            px-2 py-1 text-xs text-yellow-600 bg-yellow-50 rounded-full
            hover:bg-yellow-100 transition-colors
          "
        >
          Risiko Proyek
        </button>
        <button
          onClick={() => onActionClick('Bagaimana proses tender KPBU?')}
          className="
            px-2 py-1 text-xs text-purple-600 bg-purple-50 rounded-full
            hover:bg-purple-100 transition-colors
          "
        >
          Proses Tender
        </button>
      </div>
    </div>
  );
}
