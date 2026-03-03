import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { RankingPage } from './pages/RankingPage'
import { BracketPage } from './pages/BracketPage'
import { ResultsPage } from './pages/ResultsPage'
import { TeamProfilePage } from './pages/TeamProfilePage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/bracket" element={<BracketPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/team/:teamId" element={<TeamProfilePage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
