import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function Home() {
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('Loading campus events...')

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'approved')
      .order('date', { ascending: true })
    
    if (error) {
      setStatus('Error: ' + error.message)
    } else if (data && data.length === 0) {
      setStatus('No approved events found. Check back later!')
    } else {
      setEvents(data)
      setStatus('')
    }
  }

  async function handleRSVP(eventId) {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('registrations')
      .insert([{ user_id: user.id, event_id: eventId }]);

    if (error) {
      if (error.code === '23505') alert("Already registered!");
      else alert(error.message);
    } else {
      alert("Registration Successful!");
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>🎓 University Notice Board</h1>
      <p>{status}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {events.map((event) => (
          <div key={event.id} style={{ border: '1px solid #ddd', borderRadius: '15px', overflow: 'hidden', background: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            {event.image_url && <img src={event.image_url} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
            <div style={{ padding: '15px' }}>
              <span style={{ background: '#007bff', color: 'white', padding: '3px 10px', borderRadius: '15px', fontSize: '12px' }}>{event.category}</span>
              <h2 style={{ margin: '10px 0' }}>{event.title}</h2>
              <p style={{ color: '#555', fontSize: '14px' }}>📍 {event.location} <br/> 📅 {new Date(event.date).toLocaleString()}</p>
              <p style={{ height: '60px', overflow: 'hidden' }}>{event.description}</p>
              <button onClick={() => handleRSVP(event.id)} style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Join Event</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home