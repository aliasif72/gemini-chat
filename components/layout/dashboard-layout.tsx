"use client"

import type React from "react"

import { useEffect } from "react"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { setIsMobile } from "@/store/slices/uiSlice"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import styles from "./dashboard-layout.module.scss"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const dispatch = useAppDispatch()
  const { sidebarOpen, isMobile } = useAppSelector((state) => state.ui)

  useEffect(() => {
    const checkMobile = () => {
      dispatch(setIsMobile(window.innerWidth < 768))
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [dispatch])

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.main}>
        <Sidebar />
        <main className={`${styles.content} ${!sidebarOpen || isMobile ? styles.contentExpanded : ""}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
