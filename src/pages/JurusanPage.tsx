import { useState, useEffect } from "react"
import axios from "axios"
import { GraduationCap, Search, Plus, Pencil, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import CreateUpdateModal, { type FormField } from "@/components/CreateUpdateModal"

interface Jurusan {
  id: string; 
  nama_jurusan: string;
  deskripsi: string;
}

const jurusanFields: FormField[] = [
  { key: "nama_jurusan", label: "Nama Jurusan", placeholder: "Masukkan nama jurusan" },
  { key: "deskripsi", label: "Deskripsi", placeholder: "Masukkan deskripsi" },
]

export default function JurusanPage() {
  const [search, setSearch] = useState("")
  const [data, setData] = useState<Jurusan[]>([]) 
  const [isLoading, setIsLoading] = useState(true)

  const [createOpen, setCreateOpen] = useState(false)
  const [editItem, setEditItem] = useState<Jurusan | null>(null)

  const fetchJurusan = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("http://localhost:5000/jurusan") 
      setData(response.data)
    } catch (err) {
      console.error("Gagal mengambil data jurusan:", err)
      alert("Gagal konek ke backend Pastikan server nyala.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJurusan()
  }, [])

const filtered = data.filter(
    (item) =>
      item.nama_jurusan.toLowerCase().includes(search.toLowerCase()) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(search.toLowerCase()))
  )

  const handleCreate = async (formData: Record<string, string>) => {
    try {
      await axios.post("http://localhost:5000/jurusan", {
        nama_jurusan: formData.nama_jurusan,
        deskripsi: formData.deskripsi,
      })
      setCreateOpen(false)
      fetchJurusan() 
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.message || "Gagal membuat jurusan!")
    }
  }

  const handleUpdate = async (formData: Record<string, string>) => {
    if (!editItem) return
    try {
      await axios.put(`http://localhost:5000/jurusan/${editItem.id}`, {
        nama_jurusan: formData.nama_jurusan,
        deskripsi: formData.deskripsi,
      })
      setEditItem(null)
      fetchJurusan() 
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.message || "Gagal update jurusan!")
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Yakin nih mau hapus jurusan ini?")) {
      try {
        await axios.delete(`http://localhost:5000/jurusan/${id}`)
        fetchJurusan() 
      } catch (err: any) {
        console.error(err)
        alert(err.response?.data?.message || "Gagal hapus jurusan!")
      }
    }
  }

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
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="grid grid-cols-[60px_1fr_1fr_auto] items-center gap-4 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
          <span>No</span>
          <span>Nama Jurusan</span>
          <span>Deskripsi</span>
          <span>Aksi</span>
        </div>

        {isLoading ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            Mengambil data dari server...
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            Tidak ada data ditemukan
          </div>
        ) : (
          filtered.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-[60px_1fr_1fr_auto] items-center gap-4 border-b px-4 py-3 text-sm transition-colors last:border-b-0 hover:bg-muted/50"
            >
              <span className="font-medium text-muted-foreground">{index + 1}</span>
              <span className="font-medium">{item.nama_jurusan}</span>
              <span className="text-muted-foreground truncate">{item.deskripsi || "-"}</span>
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
        title="Tambah Jurusan"
        fields={jurusanFields}
        submitLabel="Tambah"
      />

      <CreateUpdateModal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        onSubmit={handleUpdate}
        title="Edit Jurusan"
        fields={jurusanFields}
        defaultValues={
          editItem ? { nama_jurusan: editItem.nama_jurusan, deskripsi: editItem.deskripsi || "" } : undefined
        }
        submitLabel="Simpan"
      />
    </div>
  )
}