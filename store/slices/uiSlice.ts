import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  theme: "light" | "dark" | "system"
  sidebarOpen: boolean
  isMobile: boolean
}

const initialState: UiState = {
  theme: "system",
  sidebarOpen: true,
  isMobile: false,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload
    },
  },
})

export const { setTheme, toggleSidebar, setSidebarOpen, setIsMobile } = uiSlice.actions

export default uiSlice.reducer
