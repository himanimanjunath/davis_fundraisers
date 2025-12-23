"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

//user type matching the backend response from /api/users/me
interface User {
  id: string
  email: string
  name?: string
}

//context value type
interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

//create context with undefined default (will be set by provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined)

//provider component props
interface AuthProviderProps {
  children: ReactNode
}

//AuthProvider component that manages authentication state
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  //fetch current user from API using token
  const fetchUser = async (token: string) => {
    try {
      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        let userData
        try {
          userData = await response.json()
        } catch (jsonError) {
          console.error("Caught error parsing JSON:", jsonError)
          throw new Error("Invalid response from server")
        }
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        //token is invalid or expired, remove it
        localStorage.removeItem("token")
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Caught error:", error)
      //on error, clear token and reset state
      localStorage.removeItem("token")
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  //on mount, check for token and fetch user if exists
  useEffect(() => {
    const token = localStorage.getItem("token")
    
    if (token) {
      fetchUser(token)
    } else {
      //no token, user is not authenticated
      setLoading(false)
      setIsAuthenticated(false)
    }
  }, [])

  //login function - stores token and fetches user data
  const login = (token: string) => {
    localStorage.setItem("token", token)
    fetchUser(token)
  }

  //logout function - clears token and resets state
  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setIsAuthenticated(false)
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

//custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}








