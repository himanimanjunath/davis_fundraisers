"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

interface LogoutButtonProps {
  children?: React.ReactNode
  className?: string
}

export default function LogoutButton({ children, className }: LogoutButtonProps) {
  const router = useRouter()
  const { logout } = useAuth()

  const handleClick = async () => {
    try {
      logout()
      router.push("/")
    } catch (error) {
      console.error("Caught error:", error)
      alert(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children || "Logout"}
    </button>
  )
}

