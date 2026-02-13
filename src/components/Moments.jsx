'use client'
import { useState, useEffect } from 'react'
import { db, storage } from '../firebase/config'
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function Moments({ user }) {
  const [moments, setMoments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Подписка на изменения в моментах
    const q = query(
      collection(db, 'couples', user.uid, 'moments'),
      orderBy('createdAt', 'desc')
    )
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const momentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMoments(momentsData)
    })

    return () => unsubscribe()
  }, [user.uid])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      // Создаём превью
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddMoment = async (e) => {
    e.preventDefault()
    if (!text && !photo) return

    setLoading(true)
    try {
      let photoURL = null

      // Загрузка фото если есть
      if (photo) {
        const photoRef = ref(storage, `moments/${user.uid}/${Date.now()}_${photo.name}`)
        await uploadBytes(photoRef, photo)
        photoURL = await getDownloadURL(photoRef)
      }

      // Добавление момента
      await addDoc(collection(db, 'couples', user.uid, 'moments'), {
        text,
        photoURL,
        createdAt: new Date().toISOString()
      })

      // Очистка формы
      setText('')
      setPhoto(null)
      setPhotoPreview(null)
      setShowForm(false)
    } catch (error) {
      console.error('Ошибка добавления момента:', error)
      alert('Не удалось добавить момент')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMoment = async (momentId) => {
    if (!confirm('Удалить этот момент?')) return

    try {
      await deleteDoc(doc(db, 'couples', user.uid, 'moments', momentId))
    } catch (error) {
      console.error('Ошибка удаления:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Сегодня'
    if (diffDays === 1) return 'Вчера'
    if (diffDays < 7) return `${diffDays} дней назад`
    
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📸 Наши моменты</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-pink-500 text-white w-12 h-12 rounded-full text-2xl shadow-lg hover:bg-pink-600 transition"
          >
            {showForm ? '×' : '+'}
          </button>
        </div>

        {/* Форма добавления */}
        {showForm && (
          <form onSubmit={handleAddMoment} className="card mb-6 animate-fadeIn">
            <h3 className="font-semibold text-lg mb-4">Новый момент</h3>
            
            <textarea
              placeholder="Опишите ваш момент..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input-focus mb-3 resize-none"
              rows="4"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Добавить фото
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              />
            </div>

            {/* Превью фото */}
            {photoPreview && (
              <div className="mb-4">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (!text && !photo)}
              className="btn-gradient w-full disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : '💾 Сохранить момент'}
            </button>
          </form>
        )}

        {/* Лента моментов */}
        {moments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-gray-500">Пока нет сохранённых моментов</p>
            <p className="text-sm text-gray-400 mt-2">Создайте свой первый момент!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {moments.map((moment) => (
              <div key={moment.id} className="card animate-fadeIn">
                {/* Фото */}
                {moment.photoURL && (
                  <img
                    src={moment.photoURL}
                    alt="Moment"
                    className="w-full h-64 object-cover rounded-xl mb-3"
                  />
                )}
                
                {/* Текст */}
                {moment.text && (
                  <p className="text-gray-700 mb-3 whitespace-pre-line">
                    {moment.text}
                  </p>
                )}
                
                {/* Дата и удаление */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">
                    {formatDate(moment.createdAt)}
                  </span>
                  <button
                    onClick={() => handleDeleteMoment(moment.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    🗑️ Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
