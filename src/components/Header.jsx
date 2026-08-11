export default function Header({ lang, t, onLanguageChange }) {
  return (
    <header className="header">
      <div>
        <div className="logo">FERGANA <span>NOW</span></div>
        <div className="caption">{t.subtitle}</div>
      </div>
      <div className="header-controls">
        <div className="language-switch" aria-label="Language">
          <button className={lang === 'ru' ? 'active' : ''} onClick={() => onLanguageChange('ru')}>RU</button>
          <button className={lang === 'uz' ? 'active' : ''} onClick={() => onLanguageChange('uz')}>UZ</button>
        </div>
        <div className="location-pill">📍 {t.city}</div>
      </div>
    </header>
  )
}
