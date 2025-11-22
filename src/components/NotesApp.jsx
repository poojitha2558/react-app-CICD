import { useState, useEffect } from 'react'

const NotesApp = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes')
    return savedNotes ? JSON.parse(savedNotes) : []
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'personal' })

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const categories = ['personal', 'work', 'ideas', 'important']
  const categoryColors = {
    personal: '#4CAF50',
    work: '#2196F3',
    ideas: '#FF9800',
    important: '#F44336'
  }

  const addNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note = {
        id: Date.now(),
        ...newNote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setNotes([note, ...notes])
      setNewNote({ title: '', content: '', category: 'personal' })
      setIsAddingNote(false)
    }
  }

  const updateNote = () => {
    if (editingNote.title.trim() && editingNote.content.trim()) {
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? { ...editingNote, updatedAt: new Date().toISOString() }
          : note
      ))
      setEditingNote(null)
    }
  }

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="notes-app">
      <div className="notes-header">
        <div className="notes-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <button 
            className="add-note-btn"
            onClick={() => setIsAddingNote(true)}
          >
            ➕ New Note
          </button>
        </div>
        
        <div className="notes-stats">
          <span className="stat">📊 {notes.length} notes</span>
          <span className="stat">🔍 {filteredNotes.length} showing</span>
        </div>
      </div>

      {isAddingNote && (
        <div className="note-form-modal">
          <div className="note-form">
            <h3>✨ Create New Note</h3>
            <input
              type="text"
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({...newNote, title: e.target.value})}
              className="note-title-input"
            />
            <select
              value={newNote.category}
              onChange={(e) => setNewNote({...newNote, category: e.target.value})}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
              className="note-content-input"
              rows="6"
            />
            <div className="form-actions">
              <button onClick={addNote} className="save-btn">💾 Save Note</button>
              <button onClick={() => setIsAddingNote(false)} className="cancel-btn">❌ Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingNote && (
        <div className="note-form-modal">
          <div className="note-form">
            <h3>✏️ Edit Note</h3>
            <input
              type="text"
              value={editingNote.title}
              onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
              className="note-title-input"
            />
            <select
              value={editingNote.category}
              onChange={(e) => setEditingNote({...editingNote, category: e.target.value})}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <textarea
              value={editingNote.content}
              onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
              className="note-content-input"
              rows="6"
            />
            <div className="form-actions">
              <button onClick={updateNote} className="save-btn">💾 Update Note</button>
              <button onClick={() => setEditingNote(null)} className="cancel-btn">❌ Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No notes yet</h3>
            <p>Create your first note to get started!</p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="note-card">
              <div 
                className="note-category"
                style={{ backgroundColor: categoryColors[note.category] }}
              >
                {note.category}
              </div>
              <h4 className="note-title">{note.title}</h4>
              <p className="note-content">{note.content}</p>
              <div className="note-meta">
                <span className="note-date">
                  📅 {new Date(note.createdAt).toLocaleDateString()}
                </span>
                {note.updatedAt !== note.createdAt && (
                  <span className="note-updated">
                    ✏️ Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="note-actions">
                <button 
                  onClick={() => setEditingNote(note)}
                  className="edit-btn"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => deleteNote(note.id)}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default NotesApp