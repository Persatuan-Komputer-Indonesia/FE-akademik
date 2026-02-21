import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  GraduationCap,
  School,
  LibraryBig,
  Settings,
  LogOut,
  LayoutDashboard,
  Search,
  Plus,
  Edit,
  Trash2,
  FileText,
  AlertCircle
} from 'lucide-react';

// Import Komponen UI Shadcn (Pastikan path import ini sesuai struktur projectmu)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// === 1. DEFINISI TIPE DATA (INTERFACE) ===
// Kita pisah interface Jurusan biar rapi
interface Jurusan {
  id: string;
  nama_jurusan: string;
}

interface Lesson {
  id: string;
  nama: string;
  url_file: string | null;
  // Karena backend pakai "include: { jurusan: true }", maka bentuknya object
  jurusan: Jurusan | null; 
}

const DashboardLesson = () => {
  // === STATE ===
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk UX
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === 2. FETCH DATA (CONNECT KE BACKEND) ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Panggil API Backend
        const response = await axios.get('http://localhost:5000/api/lessons');
        
        // Debugging: Cek di Console Browser apakah datanya masuk
        console.log("Data Lessons dari Backend:", response.data);
        
        setLessons(response.data);
      } catch (err: any) {
        console.error("Error fetching lessons:", err);
        
        if (err.message === "Network Error") {
            setError("Gagal terhubung ke server. Pastikan Backend (Port 5000) sudah jalan.");
        } else {
            setError("Terjadi kesalahan saat mengambil data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // === 3. DELETE DATA ===
  const handleDelete = async (id: string) => {
    if (window.confirm("Yakin mau hapus lesson ini?")) {
      try {
        await axios.delete(`http://localhost:5000api/api/lessons/${id}`);
        // Update UI (hapus item dari state tanpa reload page)
        setLessons(prev => prev.filter(lesson => lesson.id !== id));
      } catch (err) {
        alert("Gagal menghapus data. Cek koneksi server.");
      }
    }
  };

  // Filter Search
  const filteredLessons = lessons.filter((lesson) =>
    lesson.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">

      {/* ========================================= */}
      {/* BAGIAN SIDEBAR (TIDAK DIUBAH / DIHAPUS) */}
      {/* ========================================= */}
      <aside className="hidden w-64 flex-col border-r bg-white md:flex fixed h-full z-10">
        {/* Logo Area */}
        <div className="flex h-16 items-center px-6 gap-3 mb-4 border-b border-slate-100">
          <div className="bg-slate-900 p-2 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-800">Akademik</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-2 py-4">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors">
            <School className="h-5 w-5" />
            <span className="font-medium">Jurusan</span>
          </a>
          {/* MENU AKTIF */}
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-slate-100 text-slate-900 rounded-md transition-colors">
            <LibraryBig className="h-5 w-5" />
            <span className="font-medium">Lesson</span>
          </a>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t space-y-2 bg-white">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900">Admin</p>
              <p className="text-xs text-slate-500 truncate">admin@mail.com</p>
            </div>
          </div>
          <button className="flex w-full items-center gap-3 px-2 py-2 text-sm text-slate-500 hover:text-slate-900">
            <Settings className="h-4 w-4" /> Settings
          </button>
          <button className="flex w-full items-center gap-3 px-2 py-2 text-sm text-red-500 hover:text-red-600">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
      {/* ========================================= */}
      {/* AKHIR SIDEBAR */}
      {/* ========================================= */}


      {/* === MAIN CONTENT === */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto ml-64">

        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-slate-400 mb-6 text-sm">
          <LayoutDashboard className="h-4 w-4" />
          <span className="mx-1">/</span>
          <span className="text-slate-600 font-medium">Management Lesson</span>
        </div>

        {/* Title Section */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">List of Lessons</h1>
            <p className="text-slate-500">Kelola materi pelajaran dan modul akademik di sini.</p>
          </div>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white">
            <Plus className="mr-2 h-4 w-4" /> Create New Lesson
          </Button>
        </div>

        {/* === CARD TABLE CONTENT === */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-4 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari lesson berdasarkan nama..."
                  className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="text-slate-600 border-slate-200">
                Filter Data
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            
            {/* 1. KONDISI LOADING */}
            {isLoading && (
               <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mb-2"></div>
                 <p>Sedang mengambil data dari dapur...</p>
               </div>
            )}

            {/* 2. KONDISI ERROR */}
            {!isLoading && error && (
               <div className="flex flex-col items-center justify-center h-64 text-red-500 bg-red-50/50 rounded-md m-4">
                 <AlertCircle className="h-8 w-8 mb-2" />
                 <p className="font-medium">{error}</p>
                 <p className="text-sm text-slate-500 mt-1">Coba cek terminal backend kamu.</p>
               </div>
            )}

            {/* 3. KONDISI DATA SUKSES */}
            {!isLoading && !error && (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[80px] text-center">No</TableHead>
                    <TableHead className="w-[300px]">Lesson Name</TableHead>
                    <TableHead>File Link</TableHead>
                    <TableHead>Jurusan</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLessons.length > 0 ? (
                    filteredLessons.map((lesson, index) => (
                      <TableRow key={lesson.id} className="hover:bg-slate-50/50">
                        <TableCell className="text-center font-medium text-slate-500">
                            {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                              <FileText className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-slate-800">{lesson.nama}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                            {lesson.url_file ? (
                                <a href={lesson.url_file} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm truncate max-w-[200px] block">
                                {lesson.url_file}
                                </a>
                            ) : (
                                <span className="text-slate-400 text-sm italic">Tidak ada file</span>
                            )}
                        </TableCell>
                        <TableCell>
                            {/* Handling Data Relasi (Jurusan) dengan Safe Check (?.) */}
                            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 font-normal">
                                {lesson.jurusan?.nama_jurusan || "Umum"}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:text-amber-700 hover:bg-amber-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(lesson.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                        Tidak ada data lesson yang ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default DashboardLesson;