import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function AddPlaceScreen({ lang, t, onBack }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    category: '',
    address: '',
    phone: '',
    instagram: '',
    description: '',
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('place_requests')
      .insert([form])

    if (error) {
      setError(error.message)
    } else {
      setDone(true)
    }
    setLoading(false)
  }

  if (done) {
    return (
      <section className="screen-section">
        <div className="success-card">
          <h2>✅ {lang === 'uz' ? 'Yuborildi!' : 'Отправлено!'}</h2>
          <p>{lang === 'uz' ? 'Sizning arizangiz ko\'rib chiqiladi.' : 'Ваша заявка принята и будет рассмотрена модератором.'}</p>
          <button className="primary full-width" onClick={onBack}>{t.refresh || 'OK'}</button>
        </div>
      </section>
    )
  }

  return (
    <section className="screen-section">
      <div className="page-title-row">
        <button className="back-button" onClick={onBack}>←</button>
        <h1>{lang === 'uz' ? 'Joy qo\'shish' : 'Добавить место'}</h1>
      </div>

      <form className="add-place-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{lang === 'uz' ? 'Nomi' : 'Название'} *</label>
          <input
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Wine Garden"
          />
        </div>

        <div className="form-group">
          <label>{t.category}</label>
          <input
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            placeholder="Кафе, Ресторан..."
          />
        </div>

        <div className="form-group">
          <label>{t.address}</label>
          <input
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="ул. Мустакиллик, 1"
          />
        </div>

        <div className="form-group">
          <label>{t.phone}</label>
          <input
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="+998 90 ..."
          />
        </div>

        <div className="form-group">
          <label>{t.instagram}</label>
          <input
            value={form.instagram}
            onChange={e => setForm({ ...form, instagram: e.target.value })}
            placeholder="@username"
          />
        </div>

        <div className="form-group">
          <label>{lang === 'uz' ? 'Tavsif' : 'Описание'}</label>
          <textarea
            rows="3"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {error && <div className="error-text">{error}</div>}

        <button className="primary full-width" type="submit" disabled={loading}>
          {loading ? t.loading : (lang === 'uz' ? 'Yuborish' : 'Отправить заявку')}
        </button>
      </form>
    </section>
  )
}
