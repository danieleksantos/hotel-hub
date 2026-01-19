import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { LogIn, Lock, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'

export const Login: React.FC = () => {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('123456')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn({ username, password })
      navigate('/dashboard')
    } catch (error) {
      console.error('Erro no login:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden ">
        <div className="bg-primary p-4 flex items-center justify-center p-4 relative">
          <img
            src="/logo-hotel-hub.png"
            alt="Hotel Hub Logo"
            className="h-26 md:h-16 lg:h-30 w-auto object-contain transition-transform hover:scale-105"
          />
        </div>

        <div className="p-8 pt-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Usuário
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-700 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-700 outline-none transition-all"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              <LogIn className="w-5 h-5" />
              Acessar Sistema
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center flex justify-between items-center">
          <p className="text-xs text-gray-400">Hotel Hub &copy; 2026</p>
          <div className="flex gap-1 items-center">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-xs text-gray-500">System Online</p>
          </div>
        </div>
      </div>
    </div>
  )
}
