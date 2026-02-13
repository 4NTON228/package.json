'use client'
import { useEffect, useState } from 'react'

export default function Hearts() {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    // Создаём новое сердечко каждые 300мс
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now() + Math.random(), // уникальный ID
        left: Math.random() * 100, // случайная позиция по горизонтали
        duration: 3 + Math.random() * 2, // случайная длительность 3-5 секунд
        size: 20 + Math.random() * 20, // случайный размер 20-40px
        delay: Math.random() * 0.5 // небольшая задержка
      }
      
      setHearts(prev => [...prev, newHeart])
      
      // Удаляем сердечко после окончания анимации
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id))
      }, (newHeart.duration + newHeart.delay) * 1000)
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute bottom-0 animate-float"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            filter: 'drop-shadow(0 2px 4px rgba(255, 107, 157, 0.3))'
          }}
        >
          💕
        </div>
      ))}
    </div>
  )
}
