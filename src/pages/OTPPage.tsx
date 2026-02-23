import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { LoaderCircle } from "lucide-react"
import { authAPI } from "@/features/auth/auth.api"

interface LocationState {
  email: string
  fullName?: string
  password?: string
  isRegistration?: boolean
}


/* ===========================
   COMPONENT
=========================== */

export default function OtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState

  const { email, fullName, password, isRegistration } = state || {}

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [message, setMessage] = useState("")

  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!email) {
      navigate("/login")
    }
  }, [email, navigate])

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true)
      return
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

const handleVerify = async () => {
  const otpCode = otp.join("")
  if (otpCode.length !== 6) {
    setMessage("Please enter 6 digit code.")
    return
  }

  try {
    setLoading(true)
    setMessage("")

    await authAPI.forgotVerify({
      email,
      otp: otpCode,
    })

    navigate("/reset-password", {
      state: { email },
    })

  } catch (error: unknown) {
    setOtp(Array(6).fill(""))
    if (error instanceof Error) {
      setMessage(error.message || "Verification failed")
    } else {
      setMessage("Verification failed")
    }
  } finally {
    setLoading(false)
  }
}

  const handleResend = async () => {
  if (!canResend) return

  try {
    setResendLoading(true)

    if (isRegistration && fullName && password) {
      await authAPI.registerRequest({
        username: fullName,
        email,
        password,
      })
    } else {
      await authAPI.forgotRequest(email)
    }

    setTimer(60)
    setCanResend(false)
    setMessage("New OTP has been sent.")
  } catch (error: unknown) {
    if (error instanceof Error) {
      setMessage(error.message || "Failed to resend OTP.")
    } else {
      setMessage("Failed to resend OTP.")
    }
  } finally {
    setResendLoading(false)
  }
}

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          Verify Your Email
        </h2>

        <p className="text-sm text-center text-gray-500 mb-1">
          Use OTP: <span className="font-semibold">123456</span>
        </p>

        <p className="text-center font-semibold text-blue-600 mb-6">
          {email}
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => {
              if (el) {
                inputsRef.current[index] = el;
              }
              }}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-14 text-center text-xl font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          ))}
        </div>

        {message && (
          <p className="text-sm text-center text-red-500 mb-4">
            {message}
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-lg flex items-center justify-center disabled:bg-gray-400"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" size={20} />
          ) : (
            "Verify"
          )}
        </button>

        <div className="text-center mt-6 text-sm text-gray-500">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-blue-600 hover:underline"
            >
              {resendLoading ? "Sending..." : "Resend Code"}
            </button>
          ) : (
            <span>Resend in {formatTime(timer)}</span>
          )}
        </div>
      </div>
    </div>
  )
}