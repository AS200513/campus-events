import { useState } from 'react'
import { supabase } from './supabaseClient'

function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password }) 
      : await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    setLoading(false)
  }

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '100px auto', border: '1px solid #ddd', borderRadius: '15px', textAlign: 'center' }}>
      <h2>{isSignUp ? 'Join Hub' : 'Welcome Back'}</h2>
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" placeholder="Campus Email" onChange={(e) => setEmail(e.target.value)} required style={{ padding: '10px' }} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px' }} />
        <button type="submit" disabled={loading} style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          {loading ? 'Wait...' : (isSignUp ? 'Register' : 'Login')}
        </button>
      </form>
      <p onClick={() => setIsSignUp(!isSignUp)} style={{ cursor: 'pointer', color: '#007bff', marginTop: '20px' }}>
        {isSignUp ? 'Have an account? Login' : 'New here? Create account'}
      </p>
    </div>
  )
}

export default Auth