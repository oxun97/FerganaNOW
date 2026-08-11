import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Fergana NOW runtime error:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main className="fatal-screen">
        <div className="fatal-card">
          <div className="logo">FERGANA <span>NOW</span></div>
          <h1>Не удалось открыть приложение</h1>
          <p>Обнови страницу. Если ошибка повторится, открой Console и передай текст ошибки разработчику.</p>
          <button onClick={() => window.location.reload()}>Обновить</button>
          <details>
            <summary>Техническая ошибка</summary>
            <code>{String(this.state.error?.message || this.state.error)}</code>
          </details>
        </div>
      </main>
    )
  }
}
