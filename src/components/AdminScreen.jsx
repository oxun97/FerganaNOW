import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function AdminScreen({ onBack, lang, t }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    setLoading(true)
    const { data } = await supabase
      .from('place_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    if (data) setRequests(data)
    setLoading(false)
  }

  async function approve(req) {
    // 1. Insert into main places table
    const { error: insertError } = await supabase
      .from('places')
      .insert([{
        name: req.name,
        category: req.category || 'cafe',
        address: req.address,
        phone: req.phone,
        instagram: req.instagram,
        description: req.description,
        is_active: true,
        tags: req.category ? [req.category] : []
      }])

    if (!insertError) {
      // 2. Mark request as approved
      await supabase
        .from('place_requests')
        .update({ status: 'approved' })
        .eq('id', req.id)

      loadRequests()
    } else {
      alert('Error: ' + insertError.message)
    }
  }

  async function reject(id) {
    if (!confirm('Reject this request?')) return
    await supabase
      .from('place_requests')
      .update({ status: 'rejected' })
      .eq('id', id)
    loadRequests()
  }

  return (
    <section className="screen-section">
      <div className="page-title-row">
        <button className="back-button" onClick={onBack}>←</button>
        <h1>Admin Panel</h1>
      </div>

      <div className="admin-list">
        {loading ? (
          <div className="empty-card">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="empty-card">No pending requests</div>
        ) : (
          requests.map(req => (
            <article key={req.id} className="admin-request-card">
              <div className="req-header">
                <strong>{req.name}</strong>
                <span className="req-date">{new Date(req.created_at).toLocaleDateString()}</span>
              </div>
              <div className="req-body">
                <div>📍 {req.address}</div>
                <div>📞 {req.phone}</div>
                <div>📸 {req.instagram}</div>
                <p>{req.description}</p>
              </div>
              <div className="req-actions">
                <button className="primary small-button" onClick={() => approve(req)}>Approve</button>
                <button className="secondary small-button" onClick={() => reject(req.id)}>Reject</button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
