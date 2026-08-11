import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import ImageUpload from './ImageUpload.jsx'
import { localized } from '../lib/placeUtils.js'

export default function AdminScreen({ onBack, lang, t }) {
  const [tab, setTab] = useState('requests')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [places, setPlaces] = useState([])
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    loadData()
    loadPlaces()
  }, [tab])

  async function loadData() {
    setLoading(true)
    let query = supabase.from(tab === 'requests' ? 'place_requests' : tab)
      .select('*')

    if (tab === 'requests') query = query.eq('status', 'pending')

    const { data: result } = await query.order('created_at', { ascending: false })
    if (result) setData(result)
    setLoading(false)
  }

  async function loadPlaces() {
    const { data } = await supabase.from('places').select('id, name').order('name')
    if (data) setPlaces(data)
  }

  async function approve(req) {
    const { error: insertError } = await supabase
      .from('places')
      .insert([{
        name: req.name,
        category: req.category || 'cafe',
        address: req.address,
        phone: req.phone,
        instagram: req.instagram,
        description: req.description,
        image_url: req.image_url,
        is_active: true,
        tags: req.category ? [req.category] : []
      }])

    if (!insertError) {
      await supabase.from('place_requests').update({ status: 'approved' }).eq('id', req.id)
      loadData()
    } else {
      alert('Error: ' + insertError.message)
    }
  }

  async function saveItem(e) {
    e.preventDefault()
    const table = tab === 'requests' ? 'place_requests' : tab
    const isNew = !editingItem.id

    let error
    if (isNew) {
      const { error: err } = await supabase.from(table).insert([editingItem])
      error = err
    } else {
      const { error: err } = await supabase.from(table).update(editingItem).eq('id', editingItem.id)
      error = err
    }

    if (error) alert(error.message)
    else {
      setEditingItem(null)
      loadData()
    }
  }

  async function toggleActive(item) {
    const { error } = await supabase.from(tab).update({ is_active: !item.is_active }).eq('id', item.id)
    if (!error) loadData()
  }

  return (
    <section className="screen-section">
      <div className="page-title-row">
        <button className="back-button" onClick={onBack}>←</button>
        <h1>Admin Panel</h1>
        {!editingItem && tab !== 'requests' && (
          <button className="primary small-button" onClick={() => setEditingItem({ is_active: true })}>+ Add</button>
        )}
      </div>

      {!editingItem && (
        <div className="admin-tabs">
          {[
            ['requests', 'Requests'],
            ['places', 'Places'],
            ['events', 'Events'],
            ['offers', 'Offers']
          ].map(([id, label]) => (
            <button
              key={id}
              className={`admin-tab ${tab === id ? 'active' : ''}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {editingItem ? (
        <form className="add-place-form" onSubmit={saveItem}>
          <h2>{editingItem.id ? 'Edit' : 'Create'} {tab.slice(0, -1)}</h2>

          <ImageUpload
            currentImage={editingItem.image_url}
            onUpload={(url) => setEditingItem({ ...editingItem, image_url: url })}
          />

          {(tab === 'events' || tab === 'offers') && (
            <div className="form-group">
              <label>Place *</label>
              <select
                required
                value={editingItem.place_id || ''}
                onChange={e => setEditingItem({ ...editingItem, place_id: e.target.value })}
                style={{ background: '#1b1f25', color: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,.08)' }}
              >
                <option value="">Select Place</option>
                {places.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Title/Name *</label>
            <input
              required
              value={editingItem.name || editingItem.title || ''}
              onChange={e => setEditingItem({ ...editingItem, [tab === 'places' || tab === 'requests' ? 'name' : 'title']: e.target.value })}
            />
          </div>

          {(tab === 'events' || tab === 'offers') && (
            <div className="form-group">
              <label>Starts At</label>
              <input
                type="datetime-local"
                value={editingItem.starts_at ? new Date(editingItem.starts_at).toISOString().slice(0, 16) : ''}
                onChange={e => setEditingItem({ ...editingItem, starts_at: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="3"
              value={editingItem.description || ''}
              onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
            />
          </div>

          <div className="req-actions">
            <button className="primary full-width" type="submit">Save</button>
            <button className="secondary full-width" type="button" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-list">
          {loading ? (
            <div className="empty-card">Loading...</div>
          ) : data.length === 0 ? (
            <div className="empty-card">No items found</div>
          ) : (
            data.map(item => (
              <article key={item.id} className="admin-request-card">
                <div className="req-header">
                  <strong>{item.name || item.title}</strong>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {tab !== 'requests' && (
                      <span className={`status-dot ${item.is_active ? 'on' : 'off'}`} onClick={() => toggleActive(item)}>
                        {item.is_active ? 'Active' : 'Hidden'}
                      </span>
                    )}
                    <span className="req-date">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="req-body">
                  {item.address && <div>📍 {item.address}</div>}
                  {item.phone && <div>📞 {item.phone}</div>}
                  {item.description && <p style={{ fontSize: '12px', color: '#8e959f' }}>{item.description.slice(0, 60)}...</p>}
                </div>
                <div className="req-actions">
                  {tab === 'requests' ? (
                    <>
                      <button className="primary small-button" onClick={() => approve(item)}>Approve</button>
                      <button className="secondary small-button" onClick={() => setEditingItem(item)}>Edit</button>
                    </>
                  ) : (
                    <>
                      <button className="primary small-button" onClick={() => setEditingItem(item)}>Edit</button>
                      <button className="secondary small-button" onClick={() => {
                        if(confirm('Delete?')) supabase.from(tab).delete().eq('id', item.id).then(() => loadData())
                      }}>Delete</button>
                    </>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  )
}
