import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisPage'
import DashboardLayout from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import SettingsPage from './pages/SettingsPage'
import JurusanPage from './pages/JurusanPage'
import LessonPage from './pages/LessonPage'
import ForgotPasswordPage from './pages/ForgotPassPage'
import OTPPage from './pages/OTPPage'
import ResetPasswordPage from './pages/ResetPassPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Auth (Gabungan) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="jurusan" element={<JurusanPage />} />
          <Route path="lesson" element={<LessonPage />} />
          {/* BARU: Tambahkan rute untuk halaman User */}
          <Route path="user" element={<UserListPage />} /> 
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App