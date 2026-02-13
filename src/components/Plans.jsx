'use client'
import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export default function Plans({ user }) {
  const [plans, setPlans] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [planText, setPlanText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Подписка на изменения в планах
    const q = query(
      collection(db, 'couples', user.uid, 'plans'),
      orderBy('createdAt', 'desc')
    )
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plansData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPlans(plansData)
    })

    return () => unsubscribe()
  }, [user.uid])

  const handleAddPlan = async (e) => {
    e.preventDefault()
    if (!planText.trim()) return

    setLoading(true)
    try {
      await addDoc(collection(db, 'couples', user.uid, 'plans'), {
        text: planText,
        completed: false,
        createdAt: new Date().toISOString()
      })

      setPlanText('')
      setShowForm(false)
    } catch (error) {
      console.error('Ошибка добавления плана:', error)
      alert('Не удалось добавить план')
    } finally {
      setLoading(false)
    }
  }

  const togglePlan = async (planId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'couples', user.uid, 'plans', planId), {
        completed: !currentStatus
      })
    } catch (error) {
      console.error('Ошибка обновления плана:', error)
    }
  }

  const deletePlan = async (planId) => {
    if (!confirm('Удалить этот план?')) return

    try {
      await deleteDoc(doc(db, 'couples', user.uid, 'plans', planId))
    } catch (error) {
      console.error('Ошибка удаления плана:', error)
    }
  }

  const activePlans = plans.filter(p => !p.completed)
  const completedPlans = plans.filter(p => p.completed)

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">✨ Наши планы</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-pink-500 text-white w-12 h-12 rounded-full text-2xl shadow-lg hover:bg-pink-600 transition"
          >
            {showForm ? '×' : '+'}
          </button>
        </div>

        {/* Форма добавления */}
        {showForm && (
          <form onSubmit={handleAddPlan} className="card mb-6 animate-fadeIn">
            <h3 className="font-semibold text-lg mb-4">Новый план</h3>
            
            <textarea
              placeholder="Что хотите сделать вместе?
Например: Посетить Париж, Приготовить ужин вместе..."
              value={planText}
              onChange={(e) => setPlanText(e.target.value)}
              className="input-focus mb-3 resize-none"
              rows="3"
              autoFocus
            />

            <button
              type="submit"
              disabled={loading || !planText.trim()}
              className="btn-gradient w-full disabled:opacity-50"
            >
              {loading ? 'Добавление...' : '💾 Добавить план'}
            </button>
          </form>
        )}

        {/* Активные планы */}
        {activePlans.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>🎯</span>
              <span>Активные планы ({activePlans.length})</span>
            </h3>
            <div className="space-y-3">
              {activePlans.map((plan) => (
                <div key={plan.id} className="card flex items-start gap-3 animate-fadeIn">
                  <button
                    onClick={() => togglePlan(plan.id, plan.completed)}
                    className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-pink-400 hover:bg-pink-100 transition mt-1"
                  />
                  <div className="flex-1">
                    <p className="text-gray-700">{plan.text}</p>
                  </div>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="text-red-400 hover:text-red-600 text-lg flex-shrink-0"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Выполненные планы */}
        {completedPlans.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>✅</span>
              <span>Выполнено ({completedPlans.length})</span>
            </h3>
            <div className="space-y-3">
              {completedPlans.map((plan) => (
                <div key={plan.id} className="card flex items-start gap-3 opacity-60 animate-fadeIn">
                  <button
                    onClick={() => togglePlan(plan.id, plan.completed)}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-400 hover:bg-pink-500 transition mt-1 flex items-center justify-center"
                  >
                    <span className="text-white text-xs">✓</span>
                  </button>
                  <div className="flex-1">
                    <p className="text-gray-500 line-through">{plan.text}</p>
                  </div>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="text-red-400 hover:text-red-600 text-lg flex-shrink-0"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Пустое состояние */}
        {plans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500">Пока нет планов</p>
            <p className="text-sm text-gray-400 mt-2">Добавьте то, что хотите сделать вместе!</p>
          </div>
        )}

        {/* Мотивационная карточка */}
        {plans.length > 0 && (
          <div className="card bg-pink-50 mt-6">
            <div className="text-center">
              <div className="text-2xl mb-2">🌟</div>
              <p className="text-sm text-gray-600">
                <strong className="text-pink-600">
                  {completedPlans.length} из {plans.length}
                </strong> планов выполнено!
              </p>
              {activePlans.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Продолжайте в том же духе! 💪
                </p>
              )}
              {activePlans.length === 0 && completedPlans.length > 0 && (
                <p className="text-xs text-pink-600 mt-1 font-semibold">
                  🎉 Все планы выполнены! Добавьте новые!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
