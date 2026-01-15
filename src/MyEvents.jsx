import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function MyEvents() {
  const [myEvents, setMyEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRSVPs = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('registrations')
        .select(`events ( id, title, date, location, image_url )`)
        .eq('user_id', user.id)
      
      if (!error) setMyEvents(data.map(r => r.events))
      setLoading(false)
    }
    fetchRSVPs()
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>My Event Schedule</h1>
      {loading ? <p>Loading...</p> : myEvents.map(event => (
        <div key={event.id} style={{ display: 'flex', border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '10px', alignItems: 'center', gap: '20px' }}>
          {event.image_url && <img src={event.image_url} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />}
          <div>
            <h3>{event.title}</h3>
            <p>{new Date(event.date).toLocaleDateString()} @ {event.location}</p>
          </div>
        </div>
      ))}
      {!loading && myEvents.length === 0 && <p>No events joined yet.</p>}
    </div>
  )
}

export default MyEvents