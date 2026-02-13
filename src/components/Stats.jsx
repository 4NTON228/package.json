'use client'
import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function Stats({ user }) {
  const [startDate, setStartDate] = useState('')
  const [nextMeetDate, setNextMeetDate] = useState('')
  const [isEditingStart, setIsEditingStart] = useState(false)
  const [isEditingNext, setIsEditingNext] = useState(false)
  const [tempStartDate, setTempStartDate] = useState('')
  const [tempNextDate, setTempNextDate] = useState('')
  const [dailyPhrase, setDailyPhrase] = useState('')

  const phrases = [
    "Ты делаешь мой мир ярче! 🌟",
    "С тобой каждый день — праздник! 🎉",
    "Ты моё самое главное сокровище 💎",
    "Я так счастлив/счастлива рядом с тобой! 😊",
    "Ты моя половинка! 💕",
    "Спасибо, что ты есть в моей жизни! 🙏",
    "Твоя улыбка — моё любимое зрелище 😍",
    "Ты делаешь меня лучше! ✨",
    "С тобой я дома, где бы мы ни были 🏡",
    "Я выбираю тебя. Снова и снова. ❤️"
  ]

  useEffect(() => {
    loadDates()
    updateDailyPhrase()
  }, [])

  const loadDates = async () => {
    try {
      const docRef = doc(db, 'couples', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setStartDate(data.startDate || '')
        setNextMeetDate(data.nextMeetDate || '')
      }
    } catch (error) {
      console.error('Ошибка загрузки дат:', error)
    }
  }

  const updateDailyPhrase = () => {
    const today = new Date().getDate()
    const phraseIndex = today % phrases.length
    setDailyPhrase(phrases[phraseIndex])
  }

  const saveStartDate = async () => {
    if (!tempStartDate) return
    
    try {
      await setDoc(doc(db, 'couples', user.uid), { 
        startDate: tempStartDate 
      }, { merge: true })
      setStartDate(tempStartDate)
      setIsEditingStart(false)
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    }
  }

  const saveNextMeetDate = async () => {
    if (!tempNextDate) return
    
    try {
      await setDoc(doc(db, 'couples', user.uid), { 
        nextMeetDate: tempNextDate 
      }, { merge: true })
      setNextMeetDate(tempNextDate)
      setIsEditingNext(false)
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    }
  }

  const calculateDays = (fromDate) => {
    if (!fromDate) return 0
    const start = new Date(fromDate)
    const today = new Date()
    const diffTime = Math.abs(today - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateDaysUntil = (toDate) => {
    if (!toDate) return 0
    const target = new Date(toDate)
    const today = new Date()
    const diffTime = target - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано'
    return new Date(dateString).toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const daysTogether = calculateDays(startDate)
  const daysUntilMeet = calculateDaysUntil(nextMeetDate)

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Заголовок */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Наша статистика</h2>

        {/* Фраза дня */}
        <div className="card bg-gradient-to-r from-pink-100 to-pink-200 animate-fadeIn">
          <div className="text-center">
            <div className="text-3xl mb-2">💌</div>
            <p className="text-lg font-semibold text-pink-700">
              {dailyPhrase}
            </p>
            <p className="text-xs text-pink-500 mt-2">Фраза дня</p>
          </div>
        </div>

        {/* Счётчик дней вместе */}
        <div className="card">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-800">
              💕 Дней вместе
            </h3>
            <button
              onClick={() => {
                setTempStartDate(startDate)
                setIsEditingStart(!isEditingStart)
              }}
              className="text-pink-500 hover:text-pink-600"
            >
              {isEditingStart ? '✕' : '✏️'}
            </button>
          </div>

          {isEditingStart ? (
            <div className="space-y-3">
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="input-focus"
              />
              <button
                onClick={saveStartDate}
                className="btn-gradient w-full"
              >
                Сохранить
              </button>
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-pink-600 my-3">
                {daysTogether > 0 ? daysTogether : '—'}
              </div>
              <p className="text-sm text-gray-500">
                С {formatDate(startDate)}
              </p>
            </>
          )}
        </div>

        {/* Таймер до встречи */}
        <div className="card">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-800">
              ⏰ До встречи
            </h3>
            <button
              onClick={() => {
                setTempNextDate(nextMeetDate)
                setIsEditingNext(!isEditingNext)
              }}
              className="text-pink-500 hover:text-pink-600"
            >
              {isEditingNext ? '✕' : '✏️'}
            </button>
          </div>

          {isEditingNext ? (
            <div className="space-y-3">
              <input
                type="date"
                value={tempNextDate}
                onChange={(e) => setTempNextDate(e.target.value)}
                className="input-focus"
                min={new Date().toISOString().split('T')[0]}
              />
              <button
                onClick={saveNextMeetDate}
                className="btn-gradient w-full"
              >
                Сохранить
              </button>
            </div>
          ) : (
            <>
              <div className={`text-4xl font-bold my-3 ${
                daysUntilMeet > 0 ? 'text-pink-600' : 'text-gray-400'
              }`}>
                {daysUntilMeet > 0 ? `${daysUntilMeet} дн.` : '—'}
              </div>
              <p className="text-sm text-gray-500">
                {nextMeetDate ? formatDate(nextMeetDate) : 'Дата не указана'}
              </p>
              {daysUntilMeet === 0 && nextMeetDate && (
                <p className="text-pink-600 font-semibold mt-2">🎉 Сегодня встреча!</p>
              )}
              {daysUntilMeet < 0 && nextMeetDate && (
                <p className="text-gray-500 text-sm mt-2">Встреча прошла</p>
              )}
            </>
          )}
        </div>

        {/* Дополнительная инфа */}
        <div className="card bg-pink-50">
          <h3 className="font-semibold text-gray-800 mb-3">✨ Интересные факты</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Это {Math.floor(daysTogether / 7)} недель вместе</p>
            <p>• Это {Math.floor(daysTogether / 30)} месяцев вместе</p>
            <p>• Это {(daysTogether * 24).toLocaleString()} часов вместе</p>
          </div>
        </div>
      </div>
    </div>
  )
}
