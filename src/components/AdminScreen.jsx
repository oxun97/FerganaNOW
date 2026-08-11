import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import ImageUpload from './ImageUpload.jsx'

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
      alert('Ошибка: ' + insertError.message)
    }
  }

  async function saveItem(e) {
    e.preventDefault()
    const table = tab === 'requests' ? 'place_requests' : tab

    let error
    if (!editingItem.id) {
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
        <h1>Админка</h1>
        {!editingItem && tab !== 'requests' && (
          <button className="primary small-button" onClick={() => setEditingItem({ is_active: true })}>+ Добавить</button>
        )}
      </div>

      {!editingItem && (
        <div className="admin-tabs">
          {[
            ['requests', 'Заявки'],
            ['places', 'Места'],
            ['events', 'События'],
            ['offers', 'Акции']
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>{editingItem.id ? 'Изменить' : 'Создать'} {
              tab === 'places' ? 'место' :
              tab === 'events' ? 'событие' :
              tab === 'offers' ? 'акцию' : 'заявку'
            }</h2>
            <button type="button" className="text-button" onClick={() => setEditingItem(null)}>Отмена</button>
          </div>

          <div className="form-group">
            <label>Фото (Обложка)</label>
            <ImageUpload
              currentImage={editingItem.image_url}
              onUpload={(url) => setEditingItem({ ...editingItem, image_url: url })}
            />
          </div>

          {(tab === 'events' || tab === 'offers') && (
            <div className="form-group">
              <label>Заведение *</label>
              <select
                required
                value={editingItem.place_id || ''}
                onChange={e => setEditingItem({ ...editingItem, place_id: e.target.value })}
              >
                <option value="">Выберите место</option>
                {places.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>{tab === 'places' || tab === 'requests' ? 'Название (RU)' : 'Заголовок (RU)'} *</label>
              <input
                required
                value={editingItem.name || editingItem.title || ''}
                onChange={e => setEditingItem({ ...editingItem, [tab === 'places' || tab === 'requests' ? 'name' : 'title']: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{tab === 'places' || tab === 'requests' ? 'Название (UZ)' : 'Заголовок (UZ)'}</label>
              <input
                value={editingItem.name_uz || editingItem.title_uz || ''}
                onChange={e => setEditingItem({ ...editingItem, [tab === 'places' || tab === 'requests' ? 'name_uz' : 'title_uz']: e.target.value })}
              />
            </div>
          </div>

          {tab === 'places' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Категория</label>
                  <select
                    value={editingItem.category || ''}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                  >
                    <option value="">Без категории</option>
                    <option value="restaurant">Ресторан</option>
                    <option value="cafe">Кафе</option>
                    <option value="coffee">Кофейня</option>
                    <option value="karaoke">Караоке</option>
                    <option value="entertainment">Развлечения</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Средний чек (сум)</label>
                  <input
                    type="number"
                    value={editingItem.average_check || ''}
                    onChange={e => setEditingItem({ ...editingItem, average_check: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Открытие (09:00)</label>
                  <input
                    placeholder="09:00"
                    value={editingItem.open_time || ''}
                    onChange={e => setEditingItem({ ...editingItem, open_time: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Закрытие (23:00)</label>
                  <input
                    placeholder="23:00"
                    value={editingItem.close_time || ''}
                    onChange={e => setEditingItem({ ...editingItem, close_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Широта (Lat)</label>
                  <input
                    type="number" step="any"
                    value={editingItem.latitude || ''}
                    onChange={e => setEditingItem({ ...editingItem, latitude: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Долгота (Lng)</label>
                  <input
                    type="number" step="any"
                    value={editingItem.longitude || ''}
                    onChange={e => setEditingItem({ ...editingItem, longitude: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Телефон</label>
                <input
                  value={editingItem.phone || ''}
                  onChange={e => setEditingItem({ ...editingItem, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Instagram (@username)</label>
                <input
                  value={editingItem.instagram || ''}
                  onChange={e => setEditingItem({ ...editingItem, instagram: e.target.value })}
                />
              </div>
            </>
          )}

          {(tab === 'events' || tab === 'offers') && (
            <div className="form-row">
              <div className="form-group">
                <label>Начало</label>
                <input
                  type="datetime-local"
                  value={editingItem.starts_at ? new Date(editingItem.starts_at).toISOString().slice(0, 16) : ''}
                  onChange={e => setEditingItem({ ...editingItem, starts_at: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Конец (опционально)</label>
                <input
                  type="datetime-local"
                  value={editingItem.ends_at ? new Date(editingItem.ends_at).toISOString().slice(0, 16) : ''}
                  onChange={e => setEditingItem({ ...editingItem, ends_at: e.target.value })}
                />
              </div>
            </div>
          )}

          {tab === 'events' && (
            <div className="form-group">
              <label>Цена (0 = бесплатно)</label>
              <input
                type="number"
                value={editingItem.price || ''}
                onChange={e => setEditingItem({ ...editingItem, price: e.target.value })}
              />
            </div>
          )}

          {tab === 'offers' && (
            <div className="form-group">
              <label>Скидка (%)</label>
              <input
                type="number"
                value={editingItem.discount_percent || ''}
                onChange={e => setEditingItem({ ...editingItem, discount_percent: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label>Описание (RU)</label>
            <textarea
              rows="3"
              value={editingItem.description || ''}
              onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Описание (UZ)</label>
            <textarea
              rows="3"
              value={editingItem.description_uz || ''}
              onChange={e => setEditingItem({ ...editingItem, description_uz: e.target.value })}
            />
          </div>

          <div className="req-actions">
            <button className="primary full-width" type="submit">Сохранить</button>
          </div>
        </form>
      ) : (
        <div className="admin-list">
          {loading ? (
            <div className="empty-card">Загрузка...</div>
          ) : data.length === 0 ? (
            <div className="empty-card">Ничего не найдено</div>
          ) : (
            data.map(item => (
              <article key={item.id} className="admin-request-card">
                <div className="req-header">
                  <strong>{item.name || item.title}</strong>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {tab !== 'requests' && (
                      <span className={`status-dot ${item.is_active ? 'on' : 'off'}`} onClick={() => toggleActive(item)}>
                        {item.is_active ? 'Активно' : 'Скрыто'}
                      </span>
                    )}
                    <span className="req-date">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="req-body">
                  {item.address && <div>📍 {item.address}</div>}
                  {item.phone && <div>📞 {item.phone}</div>}
                  {item.starts_at && <div>🕒 {new Date(item.starts_at).toLocaleString()}</div>}
                </div>
                <div className="req-actions">
                  {tab === 'requests' ? (
                    <>
                      <button className="primary small-button" onClick={() => approve(item)}>Одобрить</button>
                      <button className="secondary small-button" onClick={() => setEditingItem(item)}>Правка</button>
                    </>
                  ) : (
                    <>
                      <button className="primary small-button" onClick={() => setEditingItem(item)}>Изменить</button>
                      <button className="secondary small-button" onClick={() => {
                        if(confirm('Удалить?')) supabase.from(tab).delete().eq('id', item.id).then(() => loadData())
                      }}>Удалить</button>
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
