import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoaderCircle } from "lucide-react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { authAPI } from "@/features/auth/auth.api"
import { useEffect } from "react"

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { email } = location.state || {}

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

    // Check if email is provided
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", {
        state: { message: "Email is required to reset password" },
      });
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirm) {
      setError("Password tidak sama")
      return
    }

    try {
      setLoading(true)
      await authAPI.forgotReset({
        email,
        newPassword: password,
      })

      navigate("/login", {
        state: { message: "Password berhasil direset" },
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Gagal reset password")
      } else {
        setError("Gagal reset password")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your new password for
          <span className="block font-semibold text-blue-600 mt-1">
            {email}
          </span>
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value)
                setError("")
              }}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full"
            type="submit"
            disabled={loading}
          >
            {loading && (
              <LoaderCircle className="animate-spin mr-2" size={18} />
            )}
            {loading ? "Processing..." : "Reset Password"}
          </Button>

          <div className="text-sm text-center text-gray-500">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="hover:underline"
            >
              Back to Login
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  </div>
)
}