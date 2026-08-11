export default function Header({ lang, t, onLanguageChange, theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="logo-group">
        <div className="logo">FERGANA <span>NOW</span></div>
        <div className="caption">{t.subtitle}</div>
      </div>
      <div className="header-controls">
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
        <div className="language-switch">
          <button className={lang === 'ru' ? 'active' : ''} onClick={() => onLanguageChange('ru')}>RU</button>
          <button className={lang === 'uz' ? 'active' : ''} onClick={() => onLanguageChange('uz')}>UZ</button>
        </div>
      </div>
    </header>
  )
}
