import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import axios from "axios"

// 1. Definisikan tipe data sesuai dengan response dari Backend (Prisma)
interface User {
  id: string; 
  username: string;
  email: string;
  role: "ADMIN" | "USER";
}

export default function UserListPage() {
  // 2. State management hanya untuk data asli dan status loading
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 3. useEffect untuk fetch Get All data saat komponen di-render
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        // Pastikan endpoint ini sesuai dengan backend Express kamu
        const response = await axios.get("http://localhost:5000/users")
        
        // Simpan data langsung ke state users
        setUsers(response.data) 
      } catch (error) {
        console.error("Gagal mengambil data user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, []) 

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      {/* Header & Breadcrumb */}
      <div>
        <div className="text-sm text-muted-foreground mb-2">
          Dashboard {">"} User
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Data Semua User</h1>
        <p className="text-muted-foreground">Melihat seluruh data pengguna terdaftar</p>
      </div>

      {/* Card Statistik Total User */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total User Terdaftar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table - Langsung mapping dari state users */}
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Sedang mengambil data dari server...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Belum ada data user terdaftar.
                </TableCell>
              </TableRow>
            ) : (
              // Kita langsung meloop data users dari state, bukan filteredUsers lagi
              users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {user.role}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}