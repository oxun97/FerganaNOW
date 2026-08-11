const items = [
  ['home', '⚡', 'home'],
  ['places', '📍', 'places'],
  ['map', '🗺️', 'map'],
  ['today', '🎉', 'today'],
  ['pick', '🎲', 'pick'],
  ['profile', '👤', 'profile'],
]

export default function BottomNav({ tab, t, onChange }) {
  return (
    <nav className="bottom-nav">
      {items.map(([key, icon, labelKey]) => (
        <button
          key={key}
          className={`nav-item ${tab === key ? 'active' : ''}`}
          onClick={() => onChange(key)}
        >
          <span>{icon}</span>
          <small>{t[labelKey]}</small>
        </button>
      ))}
    </nav>
  )
}
