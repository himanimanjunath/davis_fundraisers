//gets fundraiser data from api, (i want it to do search filtering but not yet), and renders responsive list 
//with loading and empty states

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, Calendar, MapPin, ExternalLink, Search } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
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
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set())

  const WORD_LIMIT = 45

  const truncateText = (text: string, limit: number): { truncated: string; isTruncated: boolean } => {
    const words = text.trim().split(/\s+/)
    if (words.length <= limit) {
      return { truncated: text, isTruncated: false }
    }
    const truncated = words.slice(0, limit).join(" ")
    return { truncated, isTruncated: true }
  }

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleCreateFundraiser = () => {
    if (isAuthenticated) {
      router.push("/dashboard/create")
    } else {
      router.push("/login")
    }
  }

  useEffect(() => {
    fetchFundraisers()
  }, [])

  const fetchFundraisers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
      const response = await fetch(`${apiUrl}/api/fundraisers`)

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

  const filteredFundraisers = fundraisers.filter((fundraiser) => {
    if (!searchQuery.trim()) {
      return true
    }
    const query = searchQuery.toLowerCase()
    const fundraiserName = (fundraiser.fundraiserName || "").toLowerCase()
    const clubName = (fundraiser.clubName || "").toLowerCase()
    const location = (fundraiser.location || "").toLowerCase()
    const proceedsInfo = (fundraiser.proceedsInfo || "").toLowerCase()
    
    return (
      fundraiserName.includes(query) ||
      clubName.includes(query) ||
      location.includes(query) ||
      proceedsInfo.includes(query)
    )
  })

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
              placeholder="Search by store name..."
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
            <h3 className={styles.emptyTitle}>{searchQuery ? "No fundraisers found" : "No fundraisers yet"}</h3>
            <p className={styles.emptyDescription}>
              {searchQuery
                ? `No fundraisers found at "${searchQuery}". Try a different search.`
                : "Be the first to post a fundraiser for your club!"}
            </p>
            {!searchQuery && (
              <button 
                onClick={handleCreateFundraiser}
                className={styles.primaryButton}
              >
                Post First Fundraiser
              </button>
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
                    {fundraiser.proceedsInfo && (() => {
                      const isExpanded = expandedDescriptions.has(fundraiser._id)
                      const { truncated, isTruncated } = truncateText(fundraiser.proceedsInfo, WORD_LIMIT)
                      
                      return (
                        <div className={styles.cardDescription}>
                          <p>
                            {isExpanded || !isTruncated ? fundraiser.proceedsInfo : truncated}
                            {isTruncated && !isExpanded && (
                              <>
                                {" "}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleDescription(fundraiser._id)
                                  }}
                                  className={styles.readMoreLink}
                                >
                                  ... Read more
                                </button>
                              </>
                            )}
                            {isTruncated && isExpanded && (
                              <>
                                {" "}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleDescription(fundraiser._id)
                                  }}
                                  className={styles.readMoreLink}
                                >
                                  Read less
                                </button>
                              </>
                            )}
                          </p>
                        </div>
                      )
                    })()}
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
