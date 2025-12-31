//client side dashboard page that checks for auth token, redirects users to login, and provides logged in users with navigation and actions 

"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from 'next/navigation'
import Link from "next/link"
import { Plus, Trash2 } from 'lucide-react'
import { useAuth } from "@/contexts/AuthContext"
import Navigation from "@/components/Navigation"
import styles from './dashboard.module.css'

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

export default function DashboardPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { loading, isAuthenticated, user } = useAuth()
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([])
  const [fundraisersLoading, setFundraisersLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname.startsWith("/dashboard")) {
      router.replace("/login")
    }
  }, [loading, isAuthenticated, pathname, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyFundraisers()
    }
  }, [isAuthenticated])

  const fetchMyFundraisers = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
      const response = await fetch(`${apiUrl}/api/users/me/fundraisers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFundraisers(data)
      } else {
        console.error("Failed to fetch fundraisers")
      }
    } catch (error) {
      console.error("Error fetching fundraisers:", error)
    } finally {
      setFundraisersLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this fundraiser?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("Frontend - No token found in localStorage")
        alert("You must be logged in to delete a fundraiser")
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
      const requestUrl = `${apiUrl}/api/fundraisers/${id}`
      const requestHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }

      const response = await fetch(requestUrl, {
        method: "DELETE",
        headers: requestHeaders,
      })

      //get response data
      const data = await response.json()

      //different response codes
      if (response.status === 200) {
        
        // Success - remove fundraiser from local state
        console.log("200:", data)
        setFundraisers(fundraisers.filter((f) => f._id !== id))
        alert("Fundraiser deleted successfully")

      } else if (response.status === 401) {

        // Unauthorized - missing or invalid token
        console.error(data)
        alert(data.message || "You must be logged in to delete a fundraiser")

      } else if (response.status === 403) {

        // Forbidden - user doesn't own the fundraiser
        console.error("403:", data)
        alert(data.message || "You don't have permission to delete this fundraiser")

      } else if (response.status === 404) {

        // Not found - fundraiser doesn't exist
        console.error("404:", data)
        alert(data.message || "Fundraiser not found")
        // Remove from local state if it was already deleted
        setFundraisers(fundraisers.filter((f) => f._id !== id))

      } else if (response.status === 500) {

        // Server error
        console.error("500:", data)
        alert(data.message || "Server error occurred while deleting fundraiser")

      } else {
        console.error({ status: response.status, data })
        alert(data.message || "Failed to delete fundraiser")
      }
    } catch (error) {
      console.error({
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
      alert("Error deleting fundraiser. Please try again.")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={styles.container}>
      <Navigation />

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
              {fundraisersLoading ? (
                <p className={styles.emptyText}>Loading...</p>
              ) : fundraisers.length === 0 ? (
                <p className={styles.emptyText}>
                  You haven't created any fundraisers yet. Get started by creating your first one!
                </p>
              ) : (
                <div>
                  {fundraisers.map((fundraiser) => (
                    <div key={fundraiser._id} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #e5e7eb" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0 }}>
                          {fundraiser.fundraiserName}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(fundraiser._id)
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "0.25rem",
                            color: "#ef4444",
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="Delete fundraiser"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                        {fundraiser.clubName} • {fundraiser.location}
                      </p>
                      {fundraiser.proceedsInfo && (
                        <p style={{ fontSize: "0.875rem", color: "#4b5563", marginBottom: "0.5rem" }}>
                          {fundraiser.proceedsInfo}
                        </p>
                      )}
                      <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                        {new Date(fundraiser.dateTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
