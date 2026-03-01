import api from "@/lib/api";

export interface DashboardData {
  totalJurusan: number;
  totalLesson: number;
  totalUser: number;
  totalAdmin: number;
}

export const dashboardAPI = {
  getDashboard: () => api.get<DashboardData>("/dashboard"),
};
