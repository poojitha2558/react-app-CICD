import { useState, useEffect } from 'react'

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses')
    return savedExpenses ? JSON.parse(savedExpenses) : []
  })
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  })
  const [filter, setFilter] = useState('all')
  const [dateRange, setDateRange] = useState('month')

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const categories = {
    food: { label: 'Food & Dining', icon: '🍕', color: '#FF6B6B' },
    transport: { label: 'Transportation', icon: '🚗', color: '#4ECDC4' },
    entertainment: { label: 'Entertainment', icon: '🎬', color: '#45B7D1' },
    shopping: { label: 'Shopping', icon: '🛍️', color: '#96CEB4' },
    bills: { label: 'Bills & Utilities', icon: '⚡', color: '#FFEAA7' },
    health: { label: 'Healthcare', icon: '🏥', color: '#FD79A8' },
    education: { label: 'Education', icon: '📚', color: '#A29BFE' },
    other: { label: 'Other', icon: '📦', color: '#6C5CE7' }
  }

  const addExpense = () => {
    if (newExpense.description.trim() && newExpense.amount && parseFloat(newExpense.amount) > 0) {
      const expense = {
        id: Date.now(),
        description: newExpense.description.trim(),
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
        createdAt: new Date().toISOString()
      }
      setExpenses([expense, ...expenses])
      setNewExpense({
        description: '',
        amount: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0]
      })
      setIsAddingExpense(false)
    }
  }

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  const getFilteredExpenses = () => {
    let filtered = expenses

    // Filter by category
    if (filter !== 'all') {
      filtered = filtered.filter(expense => expense.category === filter)
    }

    // Filter by date range
    const now = new Date()
    const startDate = new Date()
    
    switch (dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    filtered = filtered.filter(expense => new Date(expense.date) >= startDate)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const filteredExpenses = getFilteredExpenses()

  const calculateStats = () => {
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const categoryTotals = {}
    
    Object.keys(categories).forEach(cat => {
      categoryTotals[cat] = filteredExpenses
        .filter(expense => expense.category === cat)
        .reduce((sum, expense) => sum + expense.amount, 0)
    })

    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0]

    return {
      total,
      categoryTotals,
      topCategory: topCategory ? topCategory[0] : null,
      count: filteredExpenses.length,
      average: filteredExpenses.length > 0 ? total / filteredExpenses.length : 0
    }
  }

  const stats = calculateStats()

  return (
    <div className="expense-tracker">
      <div className="expense-header">
        <div className="expense-controls">
          <button
            className="add-expense-btn"
            onClick={() => setIsAddingExpense(true)}
          >
            💳 Add Expense
          </button>
          
          <div className="filters">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="category-filter"
            >
              <option value="all">All Categories</option>
              {Object.entries(categories).map(([key, cat]) => (
                <option key={key} value={key}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="date-filter"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        <div className="expense-stats">
          <div className="stat-card total">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-label">Total Spent</div>
              <div className="stat-value">${stats.total.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Transactions</div>
              <div className="stat-value">{stats.count}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-label">Average</div>
              <div className="stat-value">${stats.average.toFixed(2)}</div>
            </div>
          </div>
          
          {stats.topCategory && (
            <div className="stat-card">
              <div className="stat-icon">{categories[stats.topCategory].icon}</div>
              <div className="stat-content">
                <div className="stat-label">Top Category</div>
                <div className="stat-value">${stats.categoryTotals[stats.topCategory].toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isAddingExpense && (
        <div className="expense-form-modal">
          <div className="expense-form">
            <h3>💳 Add New Expense</h3>
            <div className="form-row">
              <input
                type="text"
                placeholder="Description..."
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                className="expense-description-input"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                className="expense-amount-input"
                step="0.01"
                min="0"
              />
            </div>
            <div className="form-row">
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="expense-category-select"
              >
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                className="expense-date-input"
              />
            </div>
            <div className="form-actions">
              <button onClick={addExpense} className="save-btn">💾 Save Expense</button>
              <button onClick={() => setIsAddingExpense(false)} className="cancel-btn">❌ Cancel</button>
            </div>
          </div>
        </div>
      )}

      {stats.total > 0 && (
        <div className="category-breakdown">
          <h3>📊 Category Breakdown</h3>
          <div className="category-chart">
            {Object.entries(stats.categoryTotals)
              .filter(([, amount]) => amount > 0)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const percentage = (amount / stats.total) * 100
                const cat = categories[category]
                return (
                  <div key={category} className="category-bar">
                    <div className="category-info">
                      <span className="category-name">
                        {cat.icon} {cat.label}
                      </span>
                      <span className="category-amount">
                        ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: cat.color 
                        }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      <div className="expenses-list">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <h3>No expenses found</h3>
            <p>
              {expenses.length === 0
                ? 'Start tracking your expenses!'
                : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <div className="expense-items">
            <h3>📝 Recent Transactions</h3>
            {filteredExpenses.map(expense => {
              const category = categories[expense.category]
              return (
                <div key={expense.id} className="expense-item">
                  <div 
                    className="expense-category-icon"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div className="expense-details">
                    <div className="expense-description">{expense.description}</div>
                    <div className="expense-meta">
                      <span className="expense-category">{category.label}</span>
                      <span className="expense-date">
                        📅 {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="expense-amount">
                    ${expense.amount.toFixed(2)}
                  </div>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="delete-expense-btn"
                    title="Delete expense"
                  >
                    🗑️
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpenseTracker