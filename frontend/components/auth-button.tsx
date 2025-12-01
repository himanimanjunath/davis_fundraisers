"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { LogIn, LogOut, User } from "lucide-react"
import styles from "./auth-button.module.css"

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>
  }

  if (session) {
    return (
      <div className={styles.userMenu}>
        <div className={styles.userInfo}>
          <User className={styles.userIcon} />
          <span className={styles.userEmail}>{session.user?.email}</span>
        </div>
        <button onClick={() => signOut()} className={styles.signOutButton}>
          <LogOut className={styles.buttonIcon} />
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => signIn("google")} className={styles.signInButton}>
      <LogIn className={styles.buttonIcon} />
      Sign In
    </button>
  )
}
