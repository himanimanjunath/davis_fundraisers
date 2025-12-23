//client side registration page validating user input, submitting to api route, and redirecting user after
//successful account creation 

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import styles from './register.module.css'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error("Caught error parsing JSON:", jsonError)
        throw new Error("Invalid response from server")
      }

      if (response.ok) {
        router.push("/login?registered=true")
      } else {
        const errorMessage = data.message || "Registration failed. Please try again."
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("Caught error:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setError(errorMessage || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoSection}>
          <Link href="/" className={styles.logo}>
            <Heart className={styles.logoIcon} />
            <span className={styles.logoText}>Aggie Fundraisers</span>
          </Link>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.cardTitle}>Create an account</h1>
            <p className={styles.cardDescription}>
              Register to start posting fundraisers
            </p>
          </div>
          <div className={styles.cardContent}>
            <form onSubmit={handleRegister} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className={styles.input}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@ucdavis.edu"
                  className={styles.input}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={styles.input}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={styles.input}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && (
                <p className={styles.error}>{error}</p>
              )}
              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
          <div className={styles.cardFooter}>
            <p className={styles.footerText}>
              Already have an account?{" "}
              <Link href="/login" className={styles.link}>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
