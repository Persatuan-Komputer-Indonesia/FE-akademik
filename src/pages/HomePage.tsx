import { GraduationCap, BookOpen, Users } from "lucide-react"
import { Link } from "react-router-dom"

const stats = [
  {
    title: "Total Jurusan",
    value: "12",
    icon: GraduationCap,
    href: "/dashboard/jurusan",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Total Lesson",
    value: "48",
    icon: BookOpen,
    href: "/dashboard/lesson",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Total Siswa",
    value: "1,240",
    icon: Users,
    href: "#",
    color: "bg-violet-500/10 text-violet-600",
  },
]

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di Sistem Informasi Akademik
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.href}
            className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-1 text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

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
