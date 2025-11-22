import { useState, useEffect } from 'react'

const TodoList = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  })
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all')
  const [priority, setPriority] = useState('medium')

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const priorities = {
    low: { label: 'Low', color: '#4CAF50', icon: '🟢' },
    medium: { label: 'Medium', color: '#FF9800', icon: '🟡' },
    high: { label: 'High', color: '#F44336', icon: '🔴' }
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority: priority,
        createdAt: new Date().toISOString(),
        completedAt: null
      }
      setTodos([todo, ...todos])
      setNewTodo('')
      setPriority('medium')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toISOString() : null
          }
        : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const editTodo = (id, newText) => {
    if (newText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      ))
    }
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const todoStats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    high: todos.filter(t => t.priority === 'high' && !t.completed).length
  }

  return (
    <div className="todo-app">
      <div className="todo-header">
        <div className="todo-input-section">
          <div className="todo-input-container">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs to be done?"
              className="todo-input"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select"
            >
              {Object.entries(priorities).map(([key, p]) => (
                <option key={key} value={key}>
                  {p.icon} {p.label}
                </option>
              ))}
            </select>
            <button onClick={addTodo} className="add-todo-btn">
               Add Task
            </button>
          </div>
        </div>

        <div className="todo-stats">
          <div className="stat-card">
            <span className="stat-number">{todoStats.total}</span>
            <span className="stat-label">📋 Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{todoStats.active}</span>
            <span className="stat-label">⏳ Active</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{todoStats.completed}</span>
            <span className="stat-label">✅ Done</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{todoStats.high}</span>
            <span className="stat-label">🔴 High Priority</span>
          </div>
        </div>

        <div className="todo-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            📋 All
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            ⏳ Active
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            ✅ Completed
          </button>
          {todoStats.completed > 0 && (
            <button onClick={clearCompleted} className="clear-completed-btn">
              🗑️ Clear Completed
            </button>
          )}
        </div>
      </div>

      <div className="todos-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <h3>
              {filter === 'completed' && todos.length > 0
                ? 'No completed tasks yet'
                : filter === 'active' && todos.length > 0
                ? 'No active tasks'
                : 'No tasks yet'}
            </h3>
            <p>
              {todos.length === 0
                ? 'Add your first task to get started!'
                : 'All tasks are completed! 🎉'}
            </p>
          </div>
        ) : (
          filteredTodos
            .sort((a, b) => {
              // Sort by priority (high > medium > low), then by creation date
              const priorityOrder = { high: 3, medium: 2, low: 1 }
              if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority]
              }
              return new Date(b.createdAt) - new Date(a.createdAt)
            })
            .map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
                priorities={priorities}
              />
            ))
        )}
      </div>
    </div>
  )
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit, priorities }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText)
    }
    setIsEditing(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit()
    } else if (e.key === 'Escape') {
      setEditText(todo.text)
      setIsEditing(false)
    }
  }

  const priority = priorities[todo.priority]

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-main">
        <label className="todo-checkbox">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span className="checkmark">
            {todo.completed ? '✅' : '⬜'}
          </span>
        </label>

        <div 
          className="priority-indicator"
          style={{ backgroundColor: priority.color }}
          title={`${priority.label} Priority`}
        >
          {priority.icon}
        </div>

        <div className="todo-content">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyPress}
              className="edit-todo-input"
              autoFocus
            />
          ) : (
            <span 
              className={`todo-text ${todo.completed ? 'strikethrough' : ''}`}
              onDoubleClick={() => !todo.completed && setIsEditing(true)}
            >
              {todo.text}
            </span>
          )}
        </div>
      </div>

      <div className="todo-meta">
        <span className="todo-date">
          📅 {new Date(todo.createdAt).toLocaleDateString()}
        </span>
        {todo.completed && todo.completedAt && (
          <span className="completion-date">
            ✅ {new Date(todo.completedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="todo-actions">
        {!todo.completed && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="edit-btn"
            title="Edit task"
          >
            ✏️
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="delete-btn"
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default TodoList