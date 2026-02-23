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
import { useNavigate } from "react-router-dom"
import { authAPI } from "@/features/auth/auth.api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      setLoading(true);
  
      await authAPI.forgotRequest(email);
  
      setSuccess(true); // Update the state value
      navigate("/otp", {
        state: {
          email,
          isRegistration: false,
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
 
 return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>

        {success ? (
          <CardContent>
            <p className="text-center text-green-600">
              Reset link has been sent to your email.
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  required
                />
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <LoaderCircle className="animate-spin mr-2" size={18} />
                ) : null}
                Reset Password
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
        )}
      </Card>
    </div>
  )
}