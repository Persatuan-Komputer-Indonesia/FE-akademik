// src/data/mockLessons.ts
import { type Lesson } from "../types/lesson";

export const mockLessons: Lesson[] = [
  {
    id: "1",
    nama: "Pengantar Algoritma",
    deskripsi: "Belajar dasar-dasar logika pemrograman dan flowchart.",
    jurusan_id: "J01",
    url_file: "https://files.akademik.com/algo-basic.pdf",
    jurusan: {
      id: "J01",
      nama_jurusan: "Teknik Informatika",
    },
  },
  {
    id: "2",
    nama: "Manajemen Basis Data",
    deskripsi: "Memahami query SQL dan perancangan ERD.",
    jurusan_id: "J02",
    url_file: "https://files.akademik.com/db-management.pdf",
    jurusan: {
      id: "J02",
      nama_jurusan: "Sistem Informasi",
    },
  },
  {
    id: "3",
    nama: "Jaringan Komputer Dasar",
    deskripsi: "Pengenalan TCP/IP, Routing, dan Switching.",
    jurusan_id: "J03",
    url_file: "https://files.akademik.com/jarkom-1.pdf",
    jurusan: {
      id: "J03",
      nama_jurusan: "Teknik Komputer Jaringan",
    },
  },
];