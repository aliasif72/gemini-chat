"use client"

import { useAppSelector } from "@/hooks/useAppSelector"
import styles from "./sidebar.module.scss"

export function Sidebar() {
  const { sidebarOpen, isMobile } = useAppSelector((state) => state.ui)

  if (isMobile && !sidebarOpen) return null

  return (
    <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
      <div className={styles.content}>
        {/* Sidebar content will be added here */}
        <div className={styles.placeholder}>
          <p>Sidebar Content</p>
        </div>
      </div>
    </aside>
  )
}
