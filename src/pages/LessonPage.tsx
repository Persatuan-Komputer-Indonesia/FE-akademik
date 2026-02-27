import { useState, useEffect } from "react"
import axios from "axios"
import { BookOpen, Search, Plus, Pencil, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import CreateUpdateModal, { type FormField, type FormFieldOption } from "@/components/CreateUpdateModal"

interface Jurusan {
  id: string
  nama_jurusan: string
}

interface Lesson {
  id: string
  nama: string
  url_file: string | null
  jurusan: Jurusan | null
}

export default function LessonPage() {
  const [search, setSearch] = useState("")
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [jurusans, setJurusans] = useState<Jurusan[]>([]) // State khusus simpan list Jurusan
  const [isLoading, setIsLoading] = useState(true)

  const [createOpen, setCreateOpen] = useState(false)
  const [editItem, setEditItem] = useState<Lesson | null>(null)

  // === FETCH DATA LESSON & JURUSAN BARENGAN ===
  const fetchData = async () => {
    try {
      setIsLoading(true)
      // Promise.all bikin fetch berjalan paralel, lebih cepat!
      const [resLessons, resJurusans] = await Promise.all([
        axios.get("http://localhost:5000/lessons"),
        axios.get("http://localhost:5000/jurusan")
      ])
      
      setLessons(resLessons.data)
      setJurusans(resJurusans.data)
    } catch (err) {
      console.error("Gagal mengambil data:", err)
      alert("Gagal konek ke server")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // === MENGUBAH DATA JURUSAN JADI FORMAT DROPDOWN ===
  const jurusanOptions: FormFieldOption[] = jurusans.map((j) => ({
    label: j.nama_jurusan, // Yang dilihat Admin
    value: j.id,           // Yang dikirim ke Backend
  }))

  // Konfigurasi Field Modal sekarang dipindah ke dalam agar bisa baca jurusanOptions
  const lessonFields: FormField[] = [
    { key: "nama", label: "Nama Lesson", placeholder: "Masukkan nama lesson" },
    { key: "url_file", label: "URL File", placeholder: "Masukkan link materi" },
    {
      key: "jurusan_id",
      label: "Jurusan",
      placeholder: "Pilih Jurusan",
      type: "select", // Triggers Dropdown di komponen Modal kita
      options: jurusanOptions,
    },
  ]

  const filtered = lessons.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      (item.jurusan?.nama_jurusan || "").toLowerCase().includes(search.toLowerCase())
  )

  // === CREATE LESSON ===
  const handleCreate = async (formData: Record<string, string>) => {
    try {
      await axios.post("http://localhost:5000/lessons", {
        nama: formData.nama,
        url_file: formData.url_file || null,
        jurusan_id: formData.jurusan_id,
      })
      setCreateOpen(false)
      fetchData() // Refresh tabel
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.message || "Gagal membuat lesson!")
    }
  }

  // === UPDATE LESSON ===
  const handleUpdate = async (formData: Record<string, string>) => {
    if (!editItem) return
    try {
      await axios.put(`http://localhost:5000/lessons/${editItem.id}`, {
        nama: formData.nama,
        url_file: formData.url_file || null,
        jurusan_id: formData.jurusan_id,
      })
      setEditItem(null)
      fetchData() // Refresh tabel
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.message || "Gagal update lesson!")
    }
  }

  // === DELETE LESSON ===
  const handleDelete = async (id: string) => {
    if (window.confirm("Yakin mau hapus lesson ini?")) {
      try {
        await axios.delete(`http://localhost:5000/lessons/${id}`)
        fetchData() // Refresh tabel
      } catch (err: any) {
        console.error(err)
        alert(err.response?.data?.message || "Gagal hapus lesson!")
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
          <p className="text-sm text-muted-foreground">Kelola materi pelajaran</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Lesson</p>
          <p className="mt-1 text-2xl font-bold">{lessons.length}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari lesson atau jurusan..."
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
        <div className="grid grid-cols-[60px_1fr_1fr_1fr_auto] items-center gap-4 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
          <span>No</span>
          <span>Nama Lesson</span>
          <span>Link Materi</span>
          <span>Jurusan</span>
          <span>Aksi</span>
        </div>

        {isLoading ? (
           <div className="px-4 py-12 text-center text-sm text-muted-foreground">
             Loading data dari server...
           </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            Tidak ada data ditemukan
          </div>
        ) : (
          filtered.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-[60px_1fr_1fr_1fr_auto] items-center gap-4 border-b px-4 py-3 text-sm transition-colors last:border-b-0 hover:bg-muted/50"
            >
              <span className="font-medium text-muted-foreground">{index + 1}</span>
              <span className="font-medium">{item.nama}</span>
              <span className="text-blue-500 truncate hover:underline">
                {item.url_file ? (
                  <a href={item.url_file} target="_blank" rel="noreferrer">
                    Buka File
                  </a>
                ) : (
                  <span className="text-muted-foreground no-underline">-</span>
                )}
              </span>
              <span className="text-muted-foreground truncate">
                {item.jurusan?.nama_jurusan || "Umum"}
              </span>
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