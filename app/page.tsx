"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { loadUserFromStorage } from "@/store/slices/authSlice"
import { storage } from "@/lib/storage"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function HomePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const user = storage.getUser()
    if (user) {
      dispatch(loadUserFromStorage(user))
      router.push("/dashboard")
    } else {
      router.push("/auth/login")
    }
  }, [dispatch, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
