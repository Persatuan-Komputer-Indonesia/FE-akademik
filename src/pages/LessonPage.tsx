import { useState } from "react"
import { BookOpen, Search, Plus, Pencil, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import CreateUpdateModal, { type FormField } from "@/components/CreateUpdateModal"

interface Lesson {
  id: number
  name: string
  description: string
}

const lessonFields: FormField[] = [
  { key: "name", label: "Nama Lesson", placeholder: "Masukkan nama lesson" },
  { key: "description", label: "Deskripsi", placeholder: "Masukkan deskripsi" },
]

const initialData: Lesson[] = [
  { id: 1, name: "Matematika", description: "Pelajaran dasar matematika dan logika" },
  { id: 2, name: "Bahasa Inggris", description: "Pelajaran bahasa Inggris untuk komunikasi" },
  { id: 3, name: "Pemrograman Web", description: "Pelajaran pengembangan aplikasi web" },
  { id: 4, name: "Basis Data", description: "Pelajaran pengelolaan dan desain database" },
]

export default function LessonPage() {
  const [search, setSearch] = useState("")
  const [data, setData] = useState(initialData)
  const [createOpen, setCreateOpen] = useState(false)
  const [editItem, setEditItem] = useState<Lesson | null>(null)

  const filtered = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = (formData: Record<string, string>) => {
    const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1
    setData((prev) => [...prev, { id: newId, name: formData.name, description: formData.description }])
  }

  const handleUpdate = (formData: Record<string, string>) => {
    if (!editItem) return
    setData((prev) =>
      prev.map((item) =>
        item.id === editItem.id
          ? { ...item, name: formData.name, description: formData.description }
          : item
      )
    )
  }

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lesson</h1>
          <p className="text-sm text-muted-foreground">Kelola data lesson</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Lesson</p>
          <p className="mt-1 text-2xl font-bold">{data.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Jurusan</p>
          <p className="mt-1 text-2xl font-bold">2</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Lesson Aktif</p>
          <p className="mt-1 text-2xl font-bold">{data.length}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari lesson..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="grid grid-cols-[60px_1fr_1fr_auto] items-center gap-4 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
          <span>ID</span>
          <span>Nama Lesson</span>
          <span>Deskripsi</span>
          <span>Aksi</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            Tidak ada data ditemukan
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[60px_1fr_1fr_auto] items-center gap-4 border-b px-4 py-3 text-sm transition-colors last:border-b-0 hover:bg-muted/50"
            >
              <span className="font-medium text-muted-foreground">{item.id}</span>
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground truncate">{item.description}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditItem(item)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateUpdateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        title="Tambah Lesson"
        fields={lessonFields}
        submitLabel="Tambah"
      />

      <CreateUpdateModal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        onSubmit={handleUpdate}
        title="Edit Lesson"
        fields={lessonFields}
        defaultValues={
          editItem ? { name: editItem.name, description: editItem.description } : undefined
        }
        submitLabel="Simpan"
      />
    </div>
  )
}
