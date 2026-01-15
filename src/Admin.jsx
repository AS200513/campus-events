import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function Admin() {
  const [pending, setPending] = useState([])

  useEffect(() => { 
    fetchPending() 
  }, [])

  async function fetchPending() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'pending')
    setPending(data || [])
  }

  async function approve(id) {
    const { error } = await supabase
      .from('events')
      .update({ status: 'approved' })
      .eq('id', id)
    
    if (error) {
      alert(error.message)
    } else {
      alert("Approved!")
      fetchPending() // Refresh the list
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>👮 Admin Approval Portal</h1>
      <p>Approve events here to make them visible on the main Hub.</p>
      <hr />
      {pending.length === 0 ? (
        <p>No pending events at the moment.</p>
      ) : (
        pending.map(e => (
          <div key={e.id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            marginBottom: '10px', 
            borderRadius: '10px', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f9f9f9'
          }}>
            <div>
              <h3 style={{ margin: '0' }}>{e.title}</h3>
              <p style={{ margin: '5px 0', color: '#666' }}>📍 {e.location}</p>
            </div>
            <button 
              onClick={() => approve(e.id)} 
              style={{ 
                background: '#28a745', 
                color: 'white', 
                border: 'none', 
                padding: '10px 15px', 
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Approve ✅
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default Admin