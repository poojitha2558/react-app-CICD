import { useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import NotesApp from './components/NotesApp'
import TodoList from './components/TodoList'
import ExpenseTracker from './components/ExpenseTracker'

function App() {
  const [activeTab, setActiveTab] = useState('notes')

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'notes':
        return <NotesApp />
      case 'todos':
        return <TodoList />
      case 'expenses':
        return <ExpenseTracker />
      default:
        return <NotesApp />
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <h1>📝 Personal Productivity Hub</h1>
          <p>Notes • Tasks • Expenses</p>
        </div>
      </header>
      
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="app-content">
        {renderActiveComponent()}
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2025 Personal Productivity Hub</p>
      </footer>
    </div>
  )
}

export default App
