import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Topics from './pages/Topics'
import TopicDetail from './pages/TopicDetail'
import Quiz from './pages/Quiz'
import Analytics from './pages/Analytics'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import AppLayout from './components/AppLayout'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* App Shell with Sidebar & Header */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/topics/:categorySlug" element={<Topics />} />
        <Route path="/topic/:topicId" element={<TopicDetail />} />
        
        {/* Dedicated Quiz Routes for Reliable Routing */}
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/:topicId" element={<Quiz />} />
        <Route path="/quiz/:topicId/:moduleId" element={<Quiz />} />
        <Route path="/quiz/:topicId/:moduleId/:difficulty" element={<Quiz />} />
        
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
