"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Heart, Plus } from 'lucide-react'
import styles from './dashboard.module.css'

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <Heart className={styles.logoIcon} />
            <span className={styles.logoText}>Aggie Fundraisers</span>
          </Link>
          <nav className={styles.nav}>
            <Link href="/fundraisers">
              <button className={styles.navButton}>Browse</button>
            </Link>
            <button className={`${styles.navButton} ${styles.navButtonOutline}`} onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageDescription}>
            Manage your fundraisers and club events
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card} onClick={() => router.push("/dashboard/create")}>
            <div className={styles.iconWrapper}>
              <Plus className={styles.icon} />
            </div>
            <h2 className={styles.cardTitle}>Create New Fundraiser</h2>
            <p className={styles.cardDescription}>
              Post a new fundraising event for your club or organization
            </p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>My Fundraisers</h2>
            <p className={styles.cardDescription}>
              View and manage your active fundraising events
            </p>
            <div className={styles.cardBody}>
              <p className={styles.emptyText}>
                You haven't created any fundraisers yet. Get started by creating your first one!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
