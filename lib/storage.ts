import type { Chatroom } from "@/store/slices/chatSlice"

const STORAGE_KEYS = {
  USER: "gemini_chat_user",
  CHATROOMS: "gemini_chat_rooms",
  THEME: "gemini_chat_theme",
} as const

export const storage = {
  getUser: () => {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem(STORAGE_KEYS.USER)
    return user ? JSON.parse(user) : null
  },

  setUser: (user: any) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  removeUser: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  getChatrooms: (): Chatroom[] => {
    if (typeof window === "undefined") return []
    const chatrooms = localStorage.getItem(STORAGE_KEYS.CHATROOMS)
    return chatrooms ? JSON.parse(chatrooms) : []
  },

  setChatrooms: (chatrooms: Chatroom[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.CHATROOMS, JSON.stringify(chatrooms))
  },

  getTheme: () => {
    if (typeof window === "undefined") return "system"
    return localStorage.getItem(STORAGE_KEYS.THEME) || "system"
  },

  setTheme: (theme: string) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  },
}
