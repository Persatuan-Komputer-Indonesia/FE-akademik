import { useState } from "react"
import { GraduationCap, Search, Plus, Pencil, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const initialData = [
  { id: 1, name: "Bisnis Digital", description: "Program studi yang mempelajari bisnis dan pemasaran digital" },
  { id: 2, name: "Programmer", description: "Program studi yang mempelajari pemrograman dan pengembangan perangkat lunak" },
]

export default function JurusanPage() {
  const [search, setSearch] = useState("")
  const [data] = useState(initialData)

  const filtered = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jurusan</h1>
          <p className="text-sm text-muted-foreground">Kelola data jurusan</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Jurusan</p>
          <p className="mt-1 text-2xl font-bold">{data.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Lesson</p>
          <p className="mt-1 text-2xl font-bold">24</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Jurusan Aktif</p>
          <p className="mt-1 text-2xl font-bold">{data.length}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari jurusan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="grid grid-cols-[60px_1fr_1fr_auto] items-center gap-4 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
          <span>ID</span>
          <span>Nama Jurusan</span>
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
                <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
