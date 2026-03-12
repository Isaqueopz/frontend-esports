import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AdminLayout } from './components/AdminLayout'
import { HomePage } from './pages/HomePage'
import { RankingPage } from './pages/RankingPage'
import { BracketPage } from './pages/BracketPage'
import { ResultsPage } from './pages/ResultsPage'
import { TeamProfilePage } from './pages/TeamProfilePage'
import { TeamsPage } from './pages/TeamsPage'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminMatches } from './pages/admin/AdminMatches'
import { AdminMatchEdit } from './pages/admin/AdminMatchEdit'
import { AdminTeams } from './pages/admin/AdminTeams'
import { AdminChampionships } from './pages/admin/AdminChampionships'
import { AdminLocations } from './pages/admin/AdminLocations'
import { AdminDebug } from './pages/admin/AdminDebug'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // ⚠️ SPRING BOOT INTEGRATION POINT
  // Substituir por validação real de token JWT
  const isAuthenticated = localStorage.getItem('adminToken') !== null
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

function PublicPage({ page }: { page: React.ReactNode }) {
  return <Layout>{page}</Layout>
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicPage page={<HomePage />} />} />
        <Route path="/ranking" element={<PublicPage page={<RankingPage />} />} />
        <Route path="/bracket" element={<PublicPage page={<BracketPage />} />} />
        <Route path="/results" element={<PublicPage page={<ResultsPage />} />} />
        <Route path="/teams" element={<PublicPage page={<TeamsPage />} />} />
        <Route path="/teams/:teamId" element={<PublicPage page={<TeamProfilePage />} />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="matches" element={<AdminMatches />} />
          <Route path="matches/:matchId" element={<AdminMatchEdit />} />
          <Route path="teams" element={<AdminTeams />} />
          <Route path="championships" element={<AdminChampionships />} />
          <Route path="locations" element={<AdminLocations />} />
          <Route path="debug" element={<AdminDebug />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
