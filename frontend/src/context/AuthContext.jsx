import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import soundFx from '../lib/soundFx'

const AuthContext = createContext(null)

const TOKEN_KEY = 'quiz-access-token'
const REFRESH_KEY = 'quiz-refresh-token'
const USER_KEY = 'quiz-user'
const ACCOUNTS_KEY = 'quiz_registered_accounts'

/**
 * Cryptographic SHA-256 password hasher using Web Crypto API.
 * Ensures passwords are NEVER stored in plain text anywhere.
 */
async function hashPassword(password) {
  if (!password) return ''
  const enc = new TextEncoder()
  const data = enc.encode('quizclub_arcade_salt_v1:' + password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) return null
      // Ensure no guest user is retained
      if (token.startsWith('guest-token')) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        return null
      }
      const saved = localStorage.getItem(USER_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.isGuest) {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
          return null
        }
        return parsed
      }
      return null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  // Sanitize stored accounts on mount: ensure passwords are all cryptographically hashed
  useEffect(() => {
    async function sanitizeAccounts() {
      try {
        const raw = localStorage.getItem(ACCOUNTS_KEY)
        if (!raw) return
        const accounts = JSON.parse(raw)
        let modified = false

        for (let i = 0; i < accounts.length; i++) {
          const acc = accounts[i]
          // If plain password exists, convert to secure hash and delete plain text
          if (acc.password) {
            acc.password_hash = await hashPassword(acc.password)
            delete acc.password
            modified = true
          }
        }

        if (modified) {
          localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
        }
      } catch {}
    }
    sanitizeAccounts()
  }, [])

  const persistAuth = useCallback((data) => {
    if (data.access) localStorage.setItem(TOKEN_KEY, data.access)
    if (data.refresh) localStorage.setItem(REFRESH_KEY, data.refresh)
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      setUser(data.user)
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    try {
      const res = await api.post('/auth/login/', { email, password })
      persistAuth(res.data)
      soundFx.playCoin()
      return res.data.user
    } catch (err) {
      const isNetworkErr = !err.response || err.code === 'ERR_NETWORK'
      if (isNetworkErr) {
        const inputHash = await hashPassword(password)
        const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]')
        const matched = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())

        if (matched) {
          // Compare cryptographic hashes
          const storedHash = matched.password_hash || (matched.password ? await hashPassword(matched.password) : null)
          if (storedHash === inputHash) {
            // Remove any leftover legacy plain password
            if (matched.password) {
              matched.password_hash = storedHash
              delete matched.password
              localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
            }

            const loggedInUser = {
              id: matched.id,
              name: matched.name,
              email: matched.email,
              avatar: matched.avatar || '👾',
              coins: matched.coins || 100,
              level: 1,
            }
            localStorage.setItem(TOKEN_KEY, 'local-token-' + matched.id)
            localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser))
            setUser(loggedInUser)
            soundFx.playCoin()
            return loggedInUser
          } else {
            throw new Error('Incorrect password. Please try again.')
          }
        } else {
          // Register new user with hashed password (no plain text saved)
          const newUser = {
            id: 'user_' + Date.now().toString(36),
            name: email.split('@')[0] || 'Player 1',
            email: email,
            password_hash: inputHash,
            avatar: '👾',
            coins: 100,
            level: 1,
          }
          accounts.push(newUser)
          localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
          localStorage.setItem(TOKEN_KEY, 'local-token-' + newUser.id)
          localStorage.setItem(USER_KEY, JSON.stringify(newUser))
          setUser(newUser)
          soundFx.playCoin()
          return newUser
        }
      }
      throw err
    }
  }, [persistAuth])

  const signUp = useCallback(async (name, email, password) => {
    try {
      const res = await api.post('/auth/register/', { name, email, password })
      persistAuth(res.data)
      soundFx.playLevelUp()
      return res.data.user
    } catch (err) {
      const isNetworkErr = !err.response || err.code === 'ERR_NETWORK'
      if (isNetworkErr) {
        const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]')
        const existing = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())
        if (existing) {
          throw new Error('An account with this email already exists. Please log in.')
        }

        // Store SHA-256 hashed password only
        const password_hash = await hashPassword(password)
        const newUser = {
          id: 'user_' + Date.now().toString(36),
          name: name || email.split('@')[0] || 'Player 1',
          email: email,
          password_hash: password_hash,
          avatar: '🕹️',
          coins: 150,
          level: 1,
        }
        accounts.push(newUser)
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
        localStorage.setItem(TOKEN_KEY, 'local-token-' + newUser.id)
        localStorage.setItem(USER_KEY, JSON.stringify(newUser))
        setUser(newUser)
        soundFx.playLevelUp()
        return newUser
      }
      throw err
    }
  }, [persistAuth])

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem('quizmaster-name')
    localStorage.removeItem('quizmaster-avatar')
    setUser(null)
    soundFx.playSelect()
  }, [])

  // Verify session on initial load
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      if (token.startsWith('local-token')) {
        setLoading(false)
        return
      }
      api.get('/auth/me/')
        .then((res) => {
          if (res.data?.user) {
            setUser(res.data.user)
            localStorage.setItem(USER_KEY, JSON.stringify(res.data.user))
          }
        })
        .catch(() => {
          const saved = localStorage.getItem(USER_KEY)
          if (!saved) signOut()
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

  const addCoins = useCallback((amount) => {
    setUser((prev) => {
      if (!prev) return prev
      const newCoins = (prev.coins || 0) + amount
      const updated = { ...prev, coins: newCoins }
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, updateUser, addCoins }),
    [user, loading, signIn, signUp, signOut, updateUser, addCoins],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
