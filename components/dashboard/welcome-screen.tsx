"use client"

import { useAppSelector } from "@/hooks/useAppSelector"
import { MessageCircle, Sparkles, Zap, Shield } from "lucide-react"
import styles from "./welcome-screen.module.scss"

export function WelcomeScreen() {
  const { user } = useAppSelector((state) => state.auth)

  const features = [
    {
      icon: MessageCircle,
      title: "Smart Conversations",
      description: "Engage in natural conversations with AI assistance",
    },
    {
      icon: Sparkles,
      title: "Creative Responses",
      description: "Get creative and thoughtful responses to your queries",
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "Quick responses with consistent performance",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your conversations are secure and private",
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.iconContainer}>
            <MessageCircle className={styles.heroIcon} />
          </div>
          <h1 className={styles.title}>Welcome to Gemini Chat</h1>
          <p className={styles.subtitle}>
            Hello {user?.countryCode}
            {user?.phone}! Start a conversation by creating a new chatroom.
          </p>
        </div>

        <div className={styles.features}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <feature.icon className="h-6 w-6" />
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <p className={styles.ctaText}>
            Ready to start chatting? Create your first chatroom and begin the conversation!
          </p>
        </div>
      </div>
    </div>
  )
}
