function AppShell({ title, subtitle, actions, children }) {
  return (
    <div className="app-shell">
      <main className="container">
        {(title || subtitle || actions) && (
          <header className="page-header">
            <div>
              {title && <h1 className="page-title">{title}</h1>}
              {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="header-actions">{actions}</div>}
          </header>
        )}
        {children}
      </main>
    </div>
  )
}

export default AppShell