import { Routes, Route, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import HealthCheck from './pages/HealthCheck'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BooksList from './pages/BooksList'
import BookDetail from './pages/BookDetail'
import BookForm from './pages/BookForm'
import Authors from './pages/Authors'
import Publishers from './pages/Publishers'
import MyLoans from './pages/MyLoans'
import MyReservations from './pages/MyReservations'
import AdminLoans from './pages/AdminLoans'
import Analytics from './pages/Analytics'
import './App.css'

function App() {
  const { isAdmin, user } = useAuth()

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="nav-brand">LMS</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          <Link to="/authors">Authors</Link>
          <Link to="/publishers">Publishers</Link>
          {user && <Link to="/my-loans">My Loans</Link>}
          {user && <Link to="/my-reservations">Reservations</Link>}
          {isAdmin && <Link to="/admin/loans">Admin: Loans</Link>}
          {isAdmin && <Link to="/analytics">Analytics</Link>}
          {!user ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Log In</Link>
            </>
          ) : (
            <Link to="/dashboard">{user.name}</Link>
          )}
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
          <Route path="/books" element={<BooksList />} />
          <Route path="/books/new" element={<BookForm />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/books/:id/edit" element={<BookForm />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/publishers" element={<Publishers />} />
          <Route path="/my-loans" element={<MyLoans />} />
          <Route path="/my-reservations" element={<MyReservations />} />
          <Route path="/admin/loans" element={<AdminLoans />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  )
}

export default App