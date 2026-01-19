import React, { createContext, useState, useContext, useCallback } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'

interface User {
  id: string
  username: string
}

interface SignInCredentials {
  username: string
  password: string
}

interface AuthContextData {
  signed: boolean
  user: User | null
  signIn: (credentials: SignInCredentials) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storagedUser = localStorage.getItem('@HotelHub:user')
    const storagedToken = localStorage.getItem('@HotelHub:token')

    if (storagedUser && storagedToken) {
      return JSON.parse(storagedUser)
    }

    return null
  })

  const signIn = useCallback(
    async ({ username, password }: SignInCredentials) => {
      try {
        const response = await api.post('/login', { username, password })

        const { token, user: userData } = response.data

        localStorage.setItem('@HotelHub:user', JSON.stringify(userData))
        localStorage.setItem('@HotelHub:token', token)

        setUser(userData)
      } catch (error) {
        toast.error('Erro ao logar. Verifique suas credenciais.')
        throw error
      }
    },
    [],
  )

  const signOut = useCallback(() => {
    localStorage.removeItem('@HotelHub:user')
    localStorage.removeItem('@HotelHub:token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
