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

  const handleClick = () => {
    logout()
    router.push("/")
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children || "Logout"}
    </button>
  )
}

