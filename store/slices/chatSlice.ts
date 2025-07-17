import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  image?: string
}

export interface Chatroom {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  lastMessage?: Message
}

interface ChatState {
  chatrooms: Chatroom[]
  activeChatroom: string | null
  isTyping: boolean
  searchQuery: string
  messagesLoading: boolean
  hasMoreMessages: boolean
}

const initialState: ChatState = {
  chatrooms: [],
  activeChatroom: null,
  isTyping: false,
  searchQuery: "",
  messagesLoading: false,
  hasMoreMessages: true,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatrooms: (state, action: PayloadAction<Chatroom[]>) => {
      state.chatrooms = action.payload
    },
    addChatroom: (state, action: PayloadAction<Chatroom>) => {
      state.chatrooms.unshift(action.payload)
    },
    deleteChatroom: (state, action: PayloadAction<string>) => {
      state.chatrooms = state.chatrooms.filter((room) => room.id !== action.payload)
      if (state.activeChatroom === action.payload) {
        state.activeChatroom = null
      }
    },
    setActiveChatroom: (state, action: PayloadAction<string>) => {
      state.activeChatroom = action.payload
    },
    addMessage: (state, action: PayloadAction<{ chatroomId: string; message: Message }>) => {
      const { chatroomId, message } = action.payload
      const chatroom = state.chatrooms.find((room) => room.id === chatroomId)
      if (chatroom) {
        chatroom.messages.push(message)
        chatroom.lastMessage = message
      }
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setMessagesLoading: (state, action: PayloadAction<boolean>) => {
      state.messagesLoading = action.payload
    },
    loadMoreMessages: (state, action: PayloadAction<{ chatroomId: string; messages: Message[] }>) => {
      const { chatroomId, messages } = action.payload
      const chatroom = state.chatrooms.find((room) => room.id === chatroomId)
      if (chatroom) {
        chatroom.messages = [...messages, ...chatroom.messages]
      }
    },
  },
})

export const {
  setChatrooms,
  addChatroom,
  deleteChatroom,
  setActiveChatroom,
  addMessage,
  setTyping,
  setSearchQuery,
  setMessagesLoading,
  loadMoreMessages,
} = chatSlice.actions

export default chatSlice.reducer
