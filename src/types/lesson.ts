// src/types/lesson.ts
export type Lesson = {
  id: string;
  nama: string;
  deskripsi: string;
  jurusan_id: string;
  url_file: string;
  jurusan?: {
    id: string;
    nama_jurusan: string;
  };
};