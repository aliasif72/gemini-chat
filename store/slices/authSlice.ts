import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  phone: string
  countryCode: string
  isVerified: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  otpSent: boolean
  otpVerified: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  otpSent: false,
  otpVerified: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setOtpSent: (state, action: PayloadAction<boolean>) => {
      state.otpSent = action.payload
    },
    setOtpVerified: (state, action: PayloadAction<boolean>) => {
      state.otpVerified = action.payload
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
      state.otpVerified = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.otpSent = false
      state.otpVerified = false
    },
    loadUserFromStorage: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
})

export const { setLoading, setOtpSent, setOtpVerified, loginSuccess, logout, loadUserFromStorage } = authSlice.actions

export default authSlice.reducer
