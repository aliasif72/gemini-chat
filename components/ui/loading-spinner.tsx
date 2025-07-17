import { cn } from "@/lib/utils"
import styles from "./loading-spinner.module.scss"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div className={cn(styles.spinner, styles[size], className)}>
      <div className={styles.circle} />
    </div>
  )
}
