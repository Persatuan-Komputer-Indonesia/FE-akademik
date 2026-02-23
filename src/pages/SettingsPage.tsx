import { useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  const [form, setForm] = useState({
    fullName: "Admin",
    email: "admin@mail.com",
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Save profile:", form)
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-3xl font-semibold">
            A
          </div>
          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{form.fullName}</h1>
          <p className="text-sm text-muted-foreground">{form.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input
            id="fullName"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">No. Telepon</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="oldPassword">Password Lama</Label>
          <Input
            id="oldPassword"
            type="password"
            placeholder="Masukkan password lama"
            value={form.oldPassword}
            onChange={(e) => handleChange("oldPassword", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">Password Baru</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Masukkan password baru"
            value={form.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Ulangi password baru"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
          />
        </div>

        <Button type="submit" className="w-auto">
          Simpan
        </Button>
      </form>
    </div>
  )
}
