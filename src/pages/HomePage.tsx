import { useEffect, useState } from "react"
import { GraduationCap, BookOpen, Users, ShieldCheck, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { dashboardAPI, type DashboardData } from "@/features/dashboard/dashboard.api"

interface StatCard {
  title: string
  key: keyof DashboardData
  icon: React.ElementType
  href: string
}

const statCards: StatCard[] = [
  {
    title: "Total Jurusan",
    key: "totalJurusan",
    icon: GraduationCap,
    href: "/dashboard/jurusan",
  },
  {
    title: "Total Lesson",
    key: "totalLesson",
    icon: BookOpen,
    href: "/dashboard/lesson",
  },
  {
    title: "Total User",
    key: "totalUser",
    icon: Users,
    href: "#",
  },
  {
    title: "Total Admin",
    key: "totalAdmin",
    icon: ShieldCheck,
    href: "#",
  },
]

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardAPI
      .getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError("Gagal memuat data dashboard"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di Sistem Informasi Akademik
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
          {error}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Link
              key={stat.key}
              to={stat.href}
              className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 text-3xl font-bold">
                    {data ? data[stat.key] : 0}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <stat.icon className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Aktivitas Terkini</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <div className="flex-1">
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
              <div className="h-4 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
