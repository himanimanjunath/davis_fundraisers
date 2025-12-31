"use client"

//shows sign in or sign out button depending on whether user is logged in
//reads user's auth state from AuthContext and renders correct login/logout UI

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn, LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import styles from "./auth-button.module.css"

export function AuthButton() {
  const router = useRouter()
  const { user, loading, isAuthenticated, logout } = useAuth()
  //user - logged in user obj
  //loading - whether auth state being resolved
  //isAuthenticated - bool
  //logout - clear token/session 

  //for sign out: call logout (which clears token / auth state) and redirect to homepage
  const handleSignOut = () => {
    logout()
    router.push("/")
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  //if user is authenticated + user data exists 
  if (isAuthenticated && user) {
    return (
      <div className={styles.userMenu}>
        <div className={styles.userInfo}>
          <User className={styles.userIcon} />
          <span className={styles.userEmail}>{user.email}</span>
        </div>

        <button 
          onClick={handleSignOut} 
          className={styles.signOutButton}
          //disabled={isSigningOut}
        > 
          <LogOut className={styles.buttonIcon} />
          Sign Out
        </button>
      </div>
    )
  }

  //unauthenticated UI/state (default)
  return (
    <button 
      onClick={() => router.push("/login")} 
      className={styles.signInButton}
    >
      <LogIn className={styles.buttonIcon} />
      Sign In
    </button>
  )
}
