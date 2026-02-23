import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import DashboardLesson from './pages/DashboardLesson' // Ini file yang kita buat tadi
import SettingsPage from './pages/SettingsPage'
import JurusanPage from './pages/JurusanPage'
import LessonPage from './pages/LessonPage'

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="jurusan" element={<JurusanPage />} />
          <Route path="lesson" element={<LessonPage />} />
        </Route>

        
        {/* <Route path="/lesson" element={<DashboardLesson />} /> */}
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App