import { Routes, Route, Link } from 'react-router-dom'
import HealthCheck from './pages/HealthCheck'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="nav-brand">LMS</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/register">Register</Link>
          <Link to="/login">Log In</Link>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <h1>Smart Library Management</h1>
              <HealthCheck />
            </>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App