import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Home from './Home'
import CreateEvent from './CreateEvent'
import Auth from './Auth'
import MyEvents from './MyEvents'
import Admin from './Admin'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!session) return <Auth />

  return (
    <BrowserRouter>
      <nav style={{ 
        padding: '15px', background: '#1a1a1a', color: 'white', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Hub</Link>
          <Link to="/my-rsvps" style={{ color: 'white', textDecoration: 'none' }}>📅 My RSVPs</Link>
          <Link to="/create" style={{ color: 'white', textDecoration: 'none' }}>➕ Post Event</Link>
          <Link to="/admin" style={{ color: '#ffc107', textDecoration: 'none', fontWeight: 'bold' }}>👮 Admin</Link>
        </div>
        <button onClick={() => supabase.auth.signOut()} style={{ background: '#ff4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/my-rsvps" element={<MyEvents />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App