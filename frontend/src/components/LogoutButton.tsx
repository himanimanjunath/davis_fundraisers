"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import styles from "../app/page.module.css"

export default function LogoutButton() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleClick = () => {
    logout()
    router.push("/")
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.navButton} ${styles.navButtonOutline}`}
    >
      Logout
    </button>
  )
}
