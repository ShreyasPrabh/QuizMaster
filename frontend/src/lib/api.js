import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('quiz-access-token')

  // Only attach valid JWT tokens (must contain 3 parts separated by dots, not local mock tokens)
  if (token && token.split('.').length === 3 && !token.startsWith('local-token-')) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
