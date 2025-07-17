"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { otpSchema, type OtpFormData } from "@/lib/validations/auth"
import { setLoading, loginSuccess } from "@/store/slices/authSlice"
import { simulateOtpVerify } from "@/lib/api"
import { storage } from "@/lib/storage"
import { generateId } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import styles from "./verify.module.scss"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth)
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const phone = searchParams.get("phone")
  const countryCode = searchParams.get("countryCode")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  })

  const otpValue = watch("otp") || ""

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (!phone || !countryCode) {
      router.push("/auth/login")
    }
  }, [phone, countryCode, router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = otpValue.split("")
    newOtp[index] = value
    const updatedOtp = newOtp.join("")

    setValue("otp", updatedOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const onSubmit = async (data: OtpFormData) => {
    dispatch(setLoading(true))

    try {
      const isValid = await simulateOtpVerify(data.otp)

      if (isValid) {
        const user = {
          id: generateId(),
          phone: phone!,
          countryCode: countryCode!,
          isVerified: true,
        }

        storage.setUser(user)
        dispatch(loginSuccess(user))

        toast({
          title: "Success",
          description: "Phone number verified successfully!",
        })

        router.push("/dashboard")
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check your OTP and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleResendOtp = async () => {
    if (!canResend) return

    setCanResend(false)
    setCountdown(30)

    toast({
      title: "OTP Resent",
      description: `New verification code sent to ${countryCode}${phone}`,
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Card className={styles.card}>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Verify Your Phone</CardTitle>
            <CardDescription className={styles.description}>
              Enter the 6-digit code sent to {countryCode}
              {phone}
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.field}>
                <Label className={styles.label}>Verification Code</Label>
                <div className={styles.otpContainer}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={styles.otpInput}
                      value={otpValue[index] || ""}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                  ))}
                </div>
                {errors.otp && <p className={styles.error}>{errors.otp.message}</p>}
              </div>

              <Button type="submit" className={styles.submitButton} disabled={isLoading || otpValue.length !== 6}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <div className={styles.resendSection}>
                {canResend ? (
                  <Button type="button" variant="ghost" onClick={handleResendOtp} className={styles.resendButton}>
                    Resend OTP
                  </Button>
                ) : (
                  <p className={styles.countdown}>Resend OTP in {countdown}s</p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
