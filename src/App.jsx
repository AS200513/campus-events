import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('Loading...')

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    // 1. Try to get data
    const { data, error } = await supabase
      .from('events')
      .select('*')
    
    // 2. Check for problems
    if (error) {
      console.log(error)
      setStatus('ERROR: ' + error.message)
    } 
    else if (data && data.length === 0) {
      setStatus('Success! But database returned 0 events. (Check RLS or Table)')
    } 
    else {
      setStatus('') // Clear status if we found data
      setEvents(data)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Campus Events</h1>
      
      {/* This will show us the error message */}
      <h3 style={{ color: 'red' }}>{status}</h3>

      {events.map((event) => (
        <div key={event.id} style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0', borderRadius: '8px' }}>
          <h2>{event.title}</h2>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p>{event.description}</p>
        </div>
      ))}
    </div>
  )
}

export default App