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

export interface FormField {
  key: string
  label: string
  placeholder?: string
  type?: string
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
