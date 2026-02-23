import { useState, useEffect } from "react"
import axios from "axios"
import { BookOpen, Search, Plus, Pencil, Trash2, } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import CreateUpdateModal, { type FormField } from "@/components/CreateUpdateModal"

// 1. Interface Disesuaikan dengan Tabel Lesson
interface Jurusan {
  id: string;
  nama_jurusan: string;
}

interface Lesson {
  id: string;
  nama: string;
  url_file: string | null;
  jurusan: Jurusan | null;
}

// 2. Field Modal Disesuaikan untuk Lesson (Butuh jurusan_id)
const lessonFields: FormField[] = [
  { key: "nama", label: "Nama Lesson", placeholder: "Masukkan nama lesson" },
  { key: "url_file", label: "URL File (Link)", placeholder: "Masukkan link materi (opsional)" },
  { key: "jurusan_id", label: "ID Jurusan", placeholder: "Paste ID Jurusan di sini" },
]

export default function LessonPage() {
  const [search, setSearch] = useState("")
  const [data, setData] = useState<Lesson[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editItem, setEditItem] = useState<Lesson | null>(null)

  // 3. FETCH LESSONS (BENAR KE /api/lessons)
  const fetchLessons = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('http://localhost:5000/lessons')
      setData(response.data)
      setError(null)
    } catch (err: any) {
      console.error("Error fetching lessons:", err)
      setError("Gagal mengambil data dari server.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLessons()
  }, [])

  const filtered = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      (item.jurusan?.nama_jurusan.toLowerCase() || "").includes(search.toLowerCase())
  )

  // 4. CREATE LESSON
  const handleCreate = async (formData: Record<string, string>) => {
    try {
      await axios.post('http://localhost:5000/lessons', {
        nama: formData.nama,
        url_file: formData.url_file || null,
        jurusan_id: formData.jurusan_id // Wajib kirim ID Jurusan
      })
      setCreateOpen(false)
      fetchLessons()
    } catch (err) {
      alert("Gagal menambahkan lesson. Pastikan ID Jurusan benar!")
      console.error(err)
    }
  }

  // 5. UPDATE LESSON
  const handleUpdate = async (formData: Record<string, string>) => {
    if (!editItem) return
    try {
      await axios.put(`http://localhost:5000/lessons/${editItem.id}`, {
        nama: formData.nama,
        url_file: formData.url_file || null,
        jurusan_id: formData.jurusan_id
      })
      setEditItem(null)
      fetchLessons()
    } catch (err) {
      alert("Gagal mengupdate lesson.")
      console.error(err)
    }
  }

  // 6. DELETE LESSON
  const handleDelete = async (id: string) => {
    if (window.confirm("Yakin mau hapus lesson ini?")) {
      try {
        await axios.delete(`http://localhost:5000/lessons/${id}`)
        fetchLessons()
      } catch (err) {
        alert("Gagal menghapus data.")
        console.error(err)
      }
    }
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
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_80px] items-center gap-4 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
          <span>No</span>
          <span>Nama Lesson</span>
          <span>URL File</span>
          <span>Jurusan</span>
          <span className="text-center">Aksi</span>
        </div>

        {isLoading && <div className="p-8 text-center text-muted-foreground">Loading data dari server...</div>}
        {error && <div className="p-8 text-center text-red-500">{error}</div>}

        {!isLoading && !error && filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            Tidak ada data ditemukan
          </div>
        ) : (
          !isLoading && !error && filtered.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-[auto_1fr_1fr_1fr_80px] items-center gap-4 border-b px-4 py-3 text-sm transition-colors last:border-b-0 hover:bg-muted/50"
            >
              <span className="font-medium text-muted-foreground w-6">{index + 1}</span>
              <span className="font-medium">{item.nama}</span>
              <span className="text-blue-500 truncate hover:underline">
                {item.url_file ? <a href={item.url_file} target="_blank" rel="noreferrer">Link Materi</a> : "-"}
              </span>
              <span className="text-muted-foreground truncate">
                {item.jurusan ? item.jurusan.nama_jurusan : "Umum"}
              </span>
              <div className="flex items-center justify-center gap-1">
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
          editItem ? { 
            nama: editItem.nama, 
            url_file: editItem.url_file || "", 
            jurusan_id: editItem.jurusan?.id || "" 
          } : undefined
        }
        submitLabel="Simpan"
      />
    </div>
  )
}