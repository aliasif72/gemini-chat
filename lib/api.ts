export interface Country {
  name: {
    common: string
  }
  idd: {
    root: string
    suffixes: string[]
  }
  flag: string
  cca2: string
}

export async function fetchCountries(): Promise<Country[]> {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,idd,flag,cca2")
    const countries: Country[] = await response.json()

    return countries
      .filter((country) => country.idd?.root && country.idd?.suffixes)
      .sort((a, b) => a.name.common.localeCompare(b.name.common))
  } catch (error) {
    console.error("Failed to fetch countries:", error)
    return []
  }
}

export function simulateOtpSend(phone: string, countryCode: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`OTP sent to ${countryCode}${phone}`)
      resolve(true)
    }, 2000)
  })
}

export function simulateOtpVerify(otp: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, accept any 6-digit OTP
      resolve(otp.length === 6)
    }, 1500)
  })
}

export function simulateAiResponse(message: string): Promise<string> {
  const responses = [
    "That's an interesting question! Let me think about that...",
    "I understand what you're asking. Here's my perspective on that topic.",
    "Great point! I'd be happy to help you with that.",
    "That's a thoughtful question. Let me provide you with some insights.",
    "I appreciate you sharing that with me. Here's what I think...",
    "Excellent question! Based on my understanding, I would say...",
    "That's something I can definitely help you with. Let me explain...",
    "I see what you're getting at. Here's my take on the situation...",
  ]

  return new Promise((resolve) => {
    const delay = Math.random() * 2000 + 1000 // 1-3 seconds
    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      resolve(randomResponse)
    }, delay)
  })
}
