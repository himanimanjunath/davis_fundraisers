"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Calendar, MapPin, ExternalLink } from 'lucide-react'
import styles from './fundraisers.module.css'

interface Fundraiser {
  _id: string
  clubName: string
  fundraiserName: string
  location: string
  dateTime: string
  proceedsInfo?: string
  instagramLink?: string
  flyerImage?: string
  createdAt: string
  updatedAt: string
}

export default function FundraisersPage() {
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFundraisers()
  }, [])

  const fetchFundraisers = async () => {
    try {
      console.log("[v0] Fetching fundraisers...")
      const response = await fetch("/api/fundraisers")
      
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Fetched fundraisers:", data)
        setFundraisers(data)
      } else {
        console.error("Failed to fetch fundraisers")
      }
    } catch (error) {
      console.error("Error fetching fundraisers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    })
    return { dateStr, timeStr }
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
            <Link href="/create">
              <button className={styles.navButton}>Create</button>
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Active Fundraisers</h1>
            <p className={styles.pageDescription}>
              Support UC Davis clubs while shopping downtown!
            </p>
          </div>
        </div>

        

        {isLoading ? (
          <div className={styles.grid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${styles.card} ${styles.skeleton}`}>
                <div className={styles.skeletonHeader} />
                <div className={styles.skeletonBody} />
              </div>
            ))}
          </div>
        ) : fundraisers.length === 0 ? (
          <div className={styles.emptyState}>
            <Heart className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No fundraisers yet</h3>
            <p className={styles.emptyDescription}>
              Be the first to post a fundraiser for your club!
            </p>
            <Link href="/create">
              <button className={styles.primaryButton}>Post First Fundraiser</button>
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {fundraisers.map((fundraiser) => {
              const { dateStr, timeStr } = formatDateTime(fundraiser.dateTime)
              return (
                <div key={fundraiser._id} className={styles.card}>
                  {fundraiser.flyerImage && (
                    <div className={styles.cardImage}>
                      <img 
                        src={fundraiser.flyerImage || "/placeholder.svg"} 
                        alt={`${fundraiser.fundraiserName} flyer`}
                        className={styles.flyerImage}
                      />
                    </div>
                  )}
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{fundraiser.fundraiserName}</h3>
                      <span className={styles.badge}>{fundraiser.clubName}</span>
                    </div>
                    {fundraiser.proceedsInfo && (
                      <p className={styles.cardDescription}>{fundraiser.proceedsInfo}</p>
                    )}
                    <div className={styles.cardDetails}>
                      <div className={styles.detail}>
                        <MapPin className={styles.detailIcon} />
                        <span>{fundraiser.location}</span>
                      </div>
                      <div className={styles.detail}>
                        <Calendar className={styles.detailIcon} />
                        <span>{dateStr} at {timeStr}</span>
                      </div>
                    </div>
                    {fundraiser.instagramLink && (
                      <div className={styles.cardFooter}>
                        <a
                          href={fundraiser.instagramLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.instagramButton}
                        >
                          View on Instagram
                          <ExternalLink className={styles.buttonIcon} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
