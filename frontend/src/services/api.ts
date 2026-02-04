import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000',
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@HotelHub:token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('⚠️ Sessão expirada ou token inválido. Redirecionando...')
      localStorage.removeItem('@HotelHub:token')
      localStorage.removeItem('@HotelHub:user')
    }
    return Promise.reject(error)
  },
)

export default api
