import { useState } from 'react'
import { supabase } from './supabaseClient'

function CreateEvent() {
  const [eventData, setEventData] = useState({ title: '', date: '', location: '', description: '', category: 'General' })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setEventData({ ...eventData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      let imageUrl = null
      if (image) {
        const fileName = `${Date.now()}_${image.name}`
        const { error: upError } = await supabase.storage.from('posters').upload(fileName, image)
        if (upError) throw upError
        const { data: urlData } = supabase.storage.from('posters').getPublicUrl(fileName)
        imageUrl = urlData.publicUrl
      }
      const { error: insError } = await supabase.from('events').insert([{
        ...eventData, image_url: imageUrl, organizer_id: user.id, status: 'pending'
      }])
      if (insError) throw insError
      alert('Event submitted! Waiting for admin approval.')
      window.location.href = '/'
    } catch (err) { alert(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Post a New Event</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input name="title" placeholder="Event Title" onChange={handleChange} required style={{ padding: '10px' }} />
        <input name="date" type="datetime-local" onChange={handleChange} required style={{ padding: '10px' }} />
        <select name="category" onChange={handleChange} style={{ padding: '10px' }}>
          <option value="General">General</option>
          <option value="SRC">SRC</option>
          <option value="Hall">Hall</option>
          <option value="Academic">Academic</option>
        </select>
        <input name="location" placeholder="Venue" onChange={handleChange} required style={{ padding: '10px' }} />
        <textarea name="description" placeholder="Details..." onChange={handleChange} rows="4" style={{ padding: '10px' }} />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit" disabled={loading} style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {loading ? 'Submitting...' : 'Submit Event for Approval'}
        </button>
      </form>
    </div>
  )
}

export default CreateEvent