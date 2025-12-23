//gets fundraiser data from api, (i want it to do search filtering but not yet), and renders responsive list 
//with loading and empty states

"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Calendar, MapPin, ExternalLink, Search, Heart } from "lucide-react"
import Navigation from "@/components/Navigation"
import styles from "./fundraisers.module.css"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  useEffect(() => {
    fetchFundraisers()
  }, [])

  // Debounce search query to avoid filtering on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchFundraisers = async () => {
    try {
      const response = await fetch("/api/fundraisers")

      if (response.ok) {
        const data = await response.json()
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
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    return { dateStr, timeStr }
  }

  // Filter fundraisers by title (fundraiserName) or organization name (clubName)
  const filteredFundraisers = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return fundraisers
    }

    const query = debouncedSearchQuery.toLowerCase().trim()
    return fundraisers.filter((fundraiser) => {
      const matchesTitle = fundraiser.fundraiserName.toLowerCase().includes(query)
      const matchesOrganization = fundraiser.clubName.toLowerCase().includes(query)
      return matchesTitle || matchesOrganization
    })
  }, [fundraisers, debouncedSearchQuery])

  return (
    <div className={styles.container}>
      <Navigation />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Active Fundraisers</h1>
            <p className={styles.pageDescription}>Support UC Davis clubs while shopping downtown</p>
          </div>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by fundraiser name or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
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
        ) : filteredFundraisers.length === 0 ? (
          <div className={styles.emptyState}>
            <Heart className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>{debouncedSearchQuery ? "No fundraisers found" : "No fundraisers yet"}</h3>
            <p className={styles.emptyDescription}>
              {debouncedSearchQuery
                ? `No fundraisers found matching "${debouncedSearchQuery}". Try a different search.`
                : "Be the first to post a fundraiser for your club!"}
            </p>
            {!debouncedSearchQuery && (
              <Link href="/create">
                <button className={styles.primaryButton}>Post First Fundraiser</button>
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredFundraisers.map((fundraiser) => {
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
                    {fundraiser.proceedsInfo && <p className={styles.cardDescription}>{fundraiser.proceedsInfo}</p>}
                    <div className={styles.cardDetails}>
                      <div className={styles.detail}>
                        <MapPin className={styles.detailIcon} />
                        <span>{fundraiser.location}</span>
                      </div>
                      <div className={styles.detail}>
                        <Calendar className={styles.detailIcon} />
                        <span>
                          {dateStr} at {timeStr}
                        </span>
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
