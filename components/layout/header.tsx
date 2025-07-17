"use client"

import { useTheme } from "next-themes"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { toggleSidebar } from "@/store/slices/uiSlice"
import { logout } from "@/store/slices/authSlice"
import { storage } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Moon, Sun, User, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import styles from "./header.module.scss"

export function Header() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { theme, setTheme } = useTheme()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    storage.removeUser()
    dispatch(logout())
    router.push("/auth/login")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Button variant="ghost" size="icon" onClick={() => dispatch(toggleSidebar())} className={styles.menuButton}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className={styles.title}>Gemini Chat</h1>
      </div>

      <div className={styles.right}>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className={styles.themeButton}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className={styles.userButton}>
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={styles.dropdown}>
            <div className={styles.userInfo}>
              <p className={styles.userPhone}>
                {user?.countryCode}
                {user?.phone}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={styles.menuItem}>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className={styles.logoutItem}>
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
