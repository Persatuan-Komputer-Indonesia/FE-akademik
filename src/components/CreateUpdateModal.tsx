import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

// 1. Tambahkan interface untuk opsi Dropdown
export interface FormFieldOption {
  label: string
  value: string
}

export interface FormField {
  key: string
  label: string
  placeholder?: string
  type?: string // Bisa 'text', 'password', 'select', dll
  options?: FormFieldOption[] // Khusus dipakai kalau type-nya 'select'
}

interface CreateUpdateModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Record<string, string>) => void
  title: string
  fields: FormField[]
  defaultValues?: Record<string, string>
  submitLabel?: string
}

export default function CreateUpdateModal({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  defaultValues,
  submitLabel,
}: CreateUpdateModalProps) {
  const [form, setForm] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      const initial: Record<string, string> = {}
      fields.forEach((f) => {
        initial[f.key] = defaultValues?.[f.key] ?? ""
      })
      setForm(initial)
    }
  }, [open, defaultValues, fields])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              
              {/* 2. Logika Pemilihan Render: Jika 'select', tampilkan Dropdown */}
              {field.type === "select" ? (
                <select
                  id={field.key}
                  value={form[field.key] ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  required
                  // Class Tailwind ini meniru persis gaya Input bawaan Shadcn UI
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>
                    {field.placeholder ?? "Pilih salah satu..."}
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                /* Jika bukan 'select', render Input biasa */
                <Input
                  id={field.key}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder ?? ""}
                  value={form[field.key] ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  required
                />
              )}
            </div>
          ))}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">{submitLabel ?? "Simpan"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}