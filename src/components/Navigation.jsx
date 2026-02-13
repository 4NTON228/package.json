'use client'

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', icon: '💕', label: 'Главная' },
    { id: 'calendar', icon: '📅', label: 'Даты' },
    { id: 'moments', icon: '📸', label: 'Моменты' },
    { id: 'stats', icon: '📊', label: 'Мы' },
    { id: 'plans', icon: '✨', label: 'Планы' }
  ]

  return (
    <nav className="bg-white border-t-2 border-pink-100 px-2 py-2 flex justify-around items-center sticky bottom-0 shadow-lg">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all ${
            activeTab === tab.id 
              ? 'bg-pink-100 text-pink-600 scale-105' 
              : 'text-gray-500 hover:bg-pink-50'
          }`}
        >
          <span className="text-2xl mb-1">{tab.icon}</span>
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
