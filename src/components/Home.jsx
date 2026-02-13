'use client'
import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase/config'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import Hearts from './Hearts'
import Navigation from './Navigation'
import Calendar from './Calendar'
import Moments from './Moments'
import Stats from './Stats'
import Plans from './Plans'

export default function Home({ user }) {
  const [activeTab, setActiveTab] = useState('home')
  const [message, setMessage] = useState('Я люблю тебя! ❤️')
  const [isEditing, setIsEditing] = useState(false)
  const [tempMessage, setTempMessage] = useState('')

  useEffect(() => {
    loadMessage()
  }, [])

  const loadMessage = async () => {
    try {
      const docRef = doc(db, 'couples', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists() && docSnap.data().message) {
        setMessage(docSnap.data().message)
      }
    } catch (error) {
      console.error('Ошибка загрузки сообщения:', error)
    }
  }

  const saveMessage = async () => {
    if (!tempMessage.trim()) return
    
    try {
      await setDoc(doc(db, 'couples', user.uid), { 
        message: tempMessage,
        updatedAt: new Date().toISOString()
      }, { merge: true })
      setMessage(tempMessage)
      setIsEditing(false)
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      alert('Не удалось сохранить сообщение')
    }
  }

  const handleLogout = async () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      await signOut(auth)
    }
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'calendar':
        return <Calendar user={user} />
      case 'moments':
        return <Moments user={user} />
      case 'stats':
        return <Stats user={user} />
      case 'plans':
        return <Plans user={user} />
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
            <Hearts />
            
            <div className="text-center z-10 max-w-md w-full">
              {isEditing ? (
                <div className="space-y-4 animate-fadeIn">
                  <textarea
                    value={tempMessage}
                    onChange={(e) => setTempMessage(e.target.value)}
                    className="input-focus w-full text-lg text-center resize-none"
                    rows="4"
                    placeholder="Напишите любовное сообщение..."
                    maxLength={200}
                    autoFocus
                  />
                  <div className="text-xs text-gray-400">
                    {tempMessage.length}/200 символов
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={saveMessage} 
                      className="flex-1 btn-gradient"
                      disabled={!tempMessage.trim()}
                    >
                      💾 Сохранить
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 transition"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-6 leading-tight">
                    {message}
                  </h1>
                  <button 
                    onClick={() => { 
                      setTempMessage(message)
                      setIsEditing(true)
                    }}
                    className="text-pink-400 hover:text-pink-600 transition flex items-center gap-2 mx-auto"
                  >
                    <span className="text-xl">✏️</span>
                    <span>Изменить сообщение</span>
                  </button>
                  
                  {/* Кнопка выхода */}
                  <button
                    onClick={handleLogout}
                    className="mt-8 text-gray-400 hover:text-gray-600 text-sm transition"
                  >
                    Выйти из аккаунта
                  </button>
                </div>
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {renderContent()}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
