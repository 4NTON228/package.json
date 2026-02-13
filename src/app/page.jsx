'use client'
import { useState, useEffect } from 'react'
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import Login from '../components/Login'
import Home from '../components/Home'

export default function Page() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Подписка на изменения авторизации
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    
    // Регистрация Service Worker для PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration)
          })
          .catch((error) => {
            console.log('SW registration failed: ', error)
          })
      })
    }
    
    return () => unsubscribe()
  }, [])

  // Экран загрузки
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-heart">💕</div>
          <p className="text-xl text-pink-500 font-semibold">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Показываем Login или Home в зависимости от авторизации
  return user ? <Home user={user} /> : <Login />
}