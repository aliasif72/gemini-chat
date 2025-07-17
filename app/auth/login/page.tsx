"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { phoneSchema, type PhoneFormData } from "@/lib/validations/auth"
import { setLoading, setOtpSent } from "@/store/slices/authSlice"
import { fetchCountries, simulateOtpSend, type Country } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import styles from "./login.module.scss"

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { isLoading, otpSent, isAuthenticated } = useAppSelector((state) => state.auth)
  const [countries, setCountries] = useState<Country[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  })

  const selectedCountryCode = watch("countryCode")

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countryData = await fetchCountries()
        setCountries(countryData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load countries. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoadingCountries(false)
      }
    }

    loadCountries()
  }, [toast])

  const onSubmit = async (data: PhoneFormData) => {
    dispatch(setLoading(true))

    try {
      await simulateOtpSend(data.phone, data.countryCode)
      dispatch(setOtpSent(true))
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${data.countryCode}${data.phone}`,
      })
      router.push(`/auth/verify?phone=${data.phone}&countryCode=${data.countryCode}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch(setLoading(false))
    }
  }

  if (loadingCountries) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <LoadingSpinner size="lg" />
          <p className={styles.loadingText}>Loading countries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Card className={styles.card}>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Welcome to Gemini Chat</CardTitle>
            <CardDescription className={styles.description}>Enter your phone number to get started</CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.field}>
                <Label htmlFor="countryCode" className={styles.label}>
                  Country
                </Label>
                <Select onValueChange={(value) => setValue("countryCode", value)} value={selectedCountryCode}>
                  <SelectTrigger className={styles.select}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className={styles.selectContent}>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.cca2}
                        value={`${country.idd.root}${country.idd.suffixes[0]}`}
                        className={styles.selectItem}
                      >
                        <span className={styles.countryOption}>
                          <span className={styles.flag}>{country.flag}</span>
                          <span className={styles.countryName}>{country.name.common}</span>
                          <span className={styles.countryCode}>
                            {country.idd.root}
                            {country.idd.suffixes[0]}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.countryCode && <p className={styles.error}>{errors.countryCode.message}</p>}
              </div>

              <div className={styles.field}>
                <Label htmlFor="phone" className={styles.label}>
                  Phone Number
                </Label>
                <div className={styles.phoneInput}>
                  {selectedCountryCode && <span className={styles.countryPrefix}>{selectedCountryCode}</span>}
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    className={styles.input}
                    {...register("phone")}
                  />
                </div>
                {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
              </div>

              <Button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
