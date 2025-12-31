"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import LogoutButton from "@/components/LogoutButton"
import styles from "../app/page.module.css"

export default function Navigation() {
  const { loading, isAuthenticated, user } = useAuth()

  if (loading) return null

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>
          <Heart className={styles.logoIcon} />
          <span className={styles.logoText}>Aggie Fundraisers</span>
        </Link>

        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <Link href="/fundraisers">
                <button className={styles.navButton}>Browse</button>
              </Link>
              <Link href="/dashboard">
                <button className={styles.navButton}>Dashboard</button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/fundraisers">
                <button className={styles.navButton}>Browse</button>
              </Link>
              <Link href="/login">
                <button className={`${styles.navButton} ${styles.navButtonOutline}`}>
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className={`${styles.navButton} ${styles.navButtonOutline}`}>
                  Register
                </button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
