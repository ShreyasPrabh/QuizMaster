import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'quiz-access-token'
const REFRESH_KEY = 'quiz-refresh-token'
const USER_KEY = 'quiz-user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  const persistAuth = useCallback((data) => {
    if (data.access) localStorage.setItem(TOKEN_KEY, data.access)
    if (data.refresh) localStorage.setItem(REFRESH_KEY, data.refresh)
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      setUser(data.user)
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const res = await api.post('/auth/login/', { email, password })
    persistAuth(res.data)
    return res.data.user
  }, [persistAuth])

  const signUp = useCallback(async (name, email, password) => {
    const res = await api.post('/auth/register/', { name, email, password })
    persistAuth(res.data)
    return res.data.user
  }, [persistAuth])

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  // Verify session on initial load
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      api.get('/auth/me/')
        .then((res) => {
          if (res.data?.user) {
            setUser(res.data.user)
            localStorage.setItem(USER_KEY, JSON.stringify(res.data.user))
          }
        })
        .catch(() => {
          // Token expired or invalid
          signOut()
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [signOut])

  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...updatedFields }
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, updateUser }),
    [user, loading, signIn, signUp, signOut, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
