
const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'todos', label: 'Tasks', icon: '✅' },
    { id: 'expenses', label: 'Expenses', icon: '💰' }
  ]

  return (
    <nav className="navigation">
      <div className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default Navigation