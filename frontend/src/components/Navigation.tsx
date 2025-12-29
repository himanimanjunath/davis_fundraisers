"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import LogoutButton from "@/components/LogoutButton"
import styles from "../app/page.module.css"

interface NavigationProps {
  className?: string
  logoClassName?: string
  navClassName?: string
  navButtonClassName?: string
  navButtonOutlineClassName?: string
}

export default function Navigation({
  className = styles.header,
  logoClassName = styles.logo,
  navClassName = styles.nav,
  navButtonClassName = styles.navButton,
  navButtonOutlineClassName = styles.navButtonOutline,
}: NavigationProps) {
  const { loading, isAuthenticated, user } = useAuth()

  //if loading, render nothing
  if (loading) {
    return null
  }

  return (
    <header className={className}>
      <div className={styles.headerContent}>
        <Link href="/" className={logoClassName}>
          <Heart className={styles.logoIcon} />
          <span className={styles.logoText}>Aggie Fundraisers</span>
        </Link>
        <nav className={navClassName}>
          {isAuthenticated ? (
            <>
              {user && (
                <span style={{ fontSize: "0.875rem" }}>
                  {user.name || user.email}
                </span>
              )}
              <div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
                <Link href="/fundraisers">
                  <button className={navButtonClassName}>Browse</button>
                </Link>
                <Link href="/dashboard">
                  <button className={navButtonClassName}>Dashboard</button>
                </Link>
              </div>
              <LogoutButton className={`${navButtonClassName} ${navButtonOutlineClassName}`} />
            </>
          ) : (
            <>
              <Link href="/fundraisers">
                <button className={navButtonClassName}>Browse</button>
              </Link>
              <Link href="/login">
                <button className={`${navButtonClassName} ${navButtonOutlineClassName}`}>
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className={`${navButtonClassName} ${navButtonOutlineClassName}`}>
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

