'use client'
import { useState, useEffect } from 'react'
import { db, storage } from '../firebase/config'
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function Calendar({ user }) {
  const [dates, setDates] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Подписка на изменения в календаре
    const q = query(
      collection(db, 'couples', user.uid, 'dates'),
      orderBy('date', 'desc')
    )
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const datesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setDates(datesData)
    })

    return () => unsubscribe()
  }, [user.uid])

  const handleAddDate = async (e) => {
    e.preventDefault()
    if (!title || !date) return

    setLoading(true)
    try {
      let photoURL = null

      // Загрузка фото если есть
      if (photo) {
        const photoRef = ref(storage, `dates/${user.uid}/${Date.now()}_${photo.name}`)
        await uploadBytes(photoRef, photo)
        photoURL = await getDownloadURL(photoRef)
      }

      // Добавление даты в Firestore
      await addDoc(collection(db, 'couples', user.uid, 'dates'), {
        title,
        date,
        description,
        photoURL,
        createdAt: new Date().toISOString()
      })

      // Очистка формы
      setTitle('')
      setDate('')
      setDescription('')
      setPhoto(null)
      setShowForm(false)
    } catch (error) {
      console.error('Ошибка добавления даты:', error)
      alert('Не удалось добавить дату')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDate = async (dateId) => {
    if (!confirm('Удалить эту дату?')) return

    try {
      await deleteDoc(doc(db, 'couples', user.uid, 'dates', dateId))
    } catch (error) {
      console.error('Ошибка удаления:', error)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('ru-RU', options)
  }

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📅 Наши даты</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-pink-500 text-white w-12 h-12 rounded-full text-2xl shadow-lg hover:bg-pink-600 transition"
          >
            {showForm ? '×' : '+'}
          </button>
        </div>

        {/* Форма добавления */}
        {showForm && (
          <form onSubmit={handleAddDate} className="card mb-6 animate-fadeIn">
            <h3 className="font-semibold text-lg mb-4">Добавить дату</h3>
            
            <input
              type="text"
              placeholder="Название (например: Первое свидание)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-focus mb-3"
              required
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-focus mb-3"
              required
            />

            <textarea
              placeholder="Описание (необязательно)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-focus mb-3 resize-none"
              rows="3"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фото (необязательно)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : '💾 Сохранить'}
            </button>
          </form>
        )}

        {/* Список дат */}
        {dates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📆</div>
            <p className="text-gray-500">Пока нет сохранённых дат</p>
            <p className="text-sm text-gray-400 mt-2">Нажмите "+" чтобы добавить</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dates.map((dateItem) => (
              <div key={dateItem.id} className="card animate-fadeIn">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {dateItem.title}
                  </h3>
                  <button
                    onClick={() => handleDeleteDate(dateItem.id)}
                    className="text-red-400 hover:text-red-600 text-xl"
                  >
                    🗑️
                  </button>
                </div>
                
                <p className="text-pink-500 font-medium mb-2">
                  {formatDate(dateItem.date)}
                </p>
                
                {dateItem.description && (
                  <p className="text-gray-600 mb-3">{dateItem.description}</p>
                )}
                
                {dateItem.photoURL && (
                  <img
                    src={dateItem.photoURL}
                    alt={dateItem.title}
                    className="w-full h-48 object-cover rounded-xl mt-3"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
