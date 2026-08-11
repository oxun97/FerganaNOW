import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import ImageUpload from './ImageUpload.jsx'

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
    image_url: '',
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
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✨</div>
          <h2>{lang === 'uz' ? 'Yuborildi!' : 'Отправлено!'}</h2>
          <p style={{ color: '#8e959f', margin: '12px 0 24px' }}>
            {lang === 'uz'
              ? 'Sizning arizangiz qabul qilindi va tez orada ko\'rib chiqiladi.'
              : 'Ваша заявка принята и будет рассмотрена модератором в ближайшее время.'}
          </p>
          <button className="primary full-width" onClick={onBack}>OK</button>
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

      <p style={{ color: '#8e959f', fontSize: '14px', marginBottom: '24px' }}>
        {lang === 'uz'
          ? 'Farg\'onadagi yangi joy haqida ma\'lumot bering. Biz uni tekshirib, xaritaga qo\'shamiz.'
          : 'Расскажите о новом месте в Фергане. Мы проверим данные и добавим его на карту.'}
      </p>

      <form className="add-place-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{lang === 'uz' ? 'Rasm (Fasad yoki interyer)' : 'Фото (Фасад или интерьер)'}</label>
          <ImageUpload
            currentImage={form.image_url}
            onUpload={(url) => setForm({ ...form, image_url: url })}
          />
        </div>

        <div className="form-group">
          <label>{lang === 'uz' ? 'Nomi' : 'Название'} *</label>
          <input
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder={lang === 'uz' ? 'Masalan: Wine Garden' : 'Например: Wine Garden'}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{lang === 'uz' ? 'Kategoriya' : 'Категория'}</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option value="">{lang === 'uz' ? 'Tanlang' : 'Выберите'}</option>
              <option value="restaurant">{lang === 'uz' ? 'Restoran' : 'Ресторан'}</option>
              <option value="cafe">{lang === 'uz' ? 'Kafe' : 'Кафе'}</option>
              <option value="coffee">{lang === 'uz' ? 'Qahvaxona' : 'Кофейня'}</option>
              <option value="karaoke">Караоке</option>
              <option value="entertainment">{lang === 'uz' ? 'Ko\'ngilochar' : 'Развлечения'}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{lang === 'uz' ? 'Telefon' : 'Телефон'}</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+998 90 ..."
            />
          </div>
        </div>

        <div className="form-group">
          <label>{lang === 'uz' ? 'Manzil' : 'Адрес'}</label>
          <input
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder={lang === 'uz' ? 'Ko\'cha nomi, uy raqami' : 'Название улицы, номер дома'}
          />
        </div>

        <div className="form-group">
          <label>Instagram</label>
          <input
            value={form.instagram}
            onChange={e => setForm({ ...form, instagram: e.target.value })}
            placeholder="@username"
          />
        </div>

        <div className="form-group">
          <label>{lang === 'uz' ? 'Tavsif (Qisqacha)' : 'Описание (Кратко)'}</label>
          <textarea
            rows="3"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder={lang === 'uz' ? 'Joy haqida qisqacha ma\'lumot...' : 'Коротко о заведении...'}
          />
        </div>

        {error && <div className="error-text" style={{ textAlign: 'center' }}>{error}</div>}

        <button className="primary full-width" type="submit" disabled={loading} style={{ marginTop: '10px', height: '56px', fontSize: '18px' }}>
          {loading ? t.loading : (lang === 'uz' ? 'Yuborish' : 'Отправить заявку')}
        </button>
      </form>
    </section>
  )
}
