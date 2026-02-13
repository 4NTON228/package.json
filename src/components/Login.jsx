'use client'
import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      console.error(err)
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Неверный email или пароль')
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Этот email уже зарегистрирован')
      } else if (err.code === 'auth/weak-password') {
        setError('Пароль должен быть минимум 6 символов')
      } else if (err.code === 'auth/invalid-email') {
        setError('Неверный формат email')
      } else {
        setError('Произошла ошибка. Попробуйте снова')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
        {/* Логотип */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3 animate-pulse-heart">💕</div>
          <h2 className="text-3xl font-bold text-gray-800">
            {isLogin ? 'Наша История' : 'Создать аккаунт'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isLogin ? 'Добро пожаловать обратно!' : 'Начните новую историю любви'}
          </p>
        </div>
        
        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="love@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-focus"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-focus"
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          
          {/* Ошибки */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          {/* Кнопка входа */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Подождите...' : (isLogin ? 'Войти' : 'Создать аккаунт')}
          </button>
        </form>
        
        {/* Переключение режима */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
            disabled={loading}
            className="text-pink-500 hover:text-pink-600 font-medium transition"
          >
            {isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>

        {/* Подсказка */}
        <div className="mt-6 p-4 bg-pink-50 rounded-xl text-sm text-gray-600">
          <p className="font-semibold text-pink-600 mb-1">💡 Совет:</p>
          <p>Создайте один аккаунт и поделитесь логином с партнёром, чтобы видеть общие моменты!</p>
        </div>
      </div>
    </div>
  )
}
