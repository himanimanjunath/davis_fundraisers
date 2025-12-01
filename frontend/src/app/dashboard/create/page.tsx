"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Heart, ArrowLeft, Upload, X } from 'lucide-react'
import styles from './create.module.css'

export default function CreateFundraiserPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    clubName: "",
    fundraiserName: "",
    location: "",
    date: "",
    time: "",
    proceedsInfo: "",
    instagramLink: "",
    flyerImage: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB")
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
        setFormData({ ...formData, flyerImage: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setFormData({ ...formData, flyerImage: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const dateTimeString = `${formData.date}T${formData.time}:00`
      
      const payload = {
        clubName: formData.clubName,
        fundraiserName: formData.fundraiserName,
        location: formData.location,
        dateTime: dateTimeString,
        proceedsInfo: formData.proceedsInfo,
        instagramLink: formData.instagramLink,
        flyerImage: formData.flyerImage,
      }

      const response = await fetch("/api/fundraisers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/fundraisers")
      } else {
        console.error("Failed to create fundraiser:", data)
        alert(data.message || "Failed to create fundraiser")
      }
    } catch (error) {
      console.error("Error creating fundraiser:", error)
      alert("Error creating fundraiser. Make sure your backend is running on http://localhost:4000")
    } finally {
      setIsLoading(false)
    }
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
            <Link href="/fundraisers" className={styles.navButton}>
              Browse
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <Link href="/">
            <button className={styles.backButton}>
              <ArrowLeft className={styles.backIcon} />
            </button>
          </Link>
          <div>
            <h1 className={styles.pageTitle}>Create Fundraiser</h1>
            <p className={styles.pageDescription}>
              Share your club's fundraising event with the community
            </p>
          </div>
        </div>

        <div className={styles.formWrapper}>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.centeredLabel}`}>
                  Fundraiser Flyer
                </label>
                <div className={styles.imageUploadSection}>
                  {imagePreview ? (
                    <div className={styles.imagePreviewContainer}>
                      <img 
                        src={imagePreview || "/placeholder.svg"} 
                        alt="Flyer preview" 
                        className={styles.imagePreview}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className={styles.removeImageButton}
                      >
                        <X className={styles.removeIcon} />
                      </button>
                    </div>
                  ) : (
                    <label className={styles.imageUploadBox}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className={styles.fileInput}
                      />
                      <Upload className={styles.uploadIcon} />
                      <span className={styles.uploadText}>Upload flyer image</span>
                      <span className={styles.uploadHint}>PNG, JPG up to 5MB</span>
                    </label>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="clubName" className={styles.label}>
                  Club Name *
                </label>
                <input
                  type="text"
                  id="clubName"
                  name="clubName"
                  value={formData.clubName}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="fundraiserName" className={styles.label}>
                  Fundraiser Event Name *
                </label>
                <input
                  type="text"
                  id="fundraiserName"
                  name="fundraiserName"
                  value={formData.fundraiserName}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="e.g., Bake Sale, Car Wash"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="location" className={styles.label}>
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="e.g., Downtown Davis, Memorial Union"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="date" className={styles.label}>
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="time" className={styles.label}>
                    Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="proceedsInfo" className={styles.label}>
                  How Proceeds Will Be Used
                </label>
                <textarea
                  id="proceedsInfo"
                  name="proceedsInfo"
                  value={formData.proceedsInfo}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={4}
                  placeholder="e.g., All proceeds go towards funding our club's trip to nationals"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="instagramLink" className={styles.label}>
                  Instagram Post Link
                </label>
                <input
                  type="url"
                  id="instagramLink"
                  name="instagramLink"
                  value={formData.instagramLink}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="https://instagram.com/p/..."
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Fundraiser"}
                </button>
                <Link href="/">
                  <button type="button" className={styles.cancelButton}>
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
