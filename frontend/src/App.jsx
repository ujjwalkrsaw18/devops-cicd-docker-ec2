import React, { useEffect, useState } from 'react';
import './styles.css';

// Use /api endpoint - the backend serves both API and frontend static files
const apiUrl = '/api';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data.todos);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });
      if (!response.ok) throw new Error('Failed to create todo');
      const data = await response.json();
      setTodos([...todos, data.todo]);
      setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  // Update todo
  const handleUpdateTodo = async (id, updates) => {
    try {
      const response = await fetch(`${apiUrl}/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update todo');
      const data = await response.json();
      setTodos(todos.map(t => t.id === id ? data.todo : t));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/todos/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle todo completion
  const handleToggleTodo = (todo) => {
    handleUpdateTodo(todo.id, { completed: !todo.completed });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="app-container">
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>

      <header className="header">
        <div className="header-content">
          <h1>📋 Task Master</h1>
          <p>Organize your life, one task at a time</p>
        </div>
      </header>

      <main className="main-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{color: '#10b981'}}>{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{color: '#f59e0b'}}>{stats.active}</div>
            <div className="stat-label">Remaining</div>
          </div>
        </div>

        {/* Add New Todo Form */}
        <div className="form-container">
          <h2>Create New Task</h2>
          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              placeholder="Task title..."
              value={newTodo.title}
              onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
              className="input-field"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={newTodo.description}
              onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
              className="textarea-field"
              rows="2"
            ></textarea>
            <div className="form-row">
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({...newTodo, priority: e.target.value})}
                className="select-field"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="date"
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo({...newTodo, dueDate: e.target.value})}
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-primary">+ Add Task</button>
          </form>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              className={`btn-filter ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && <div className="error-message">⚠️ {error}</div>}

        {/* Loading State */}
        {loading && <div className="loading">Loading tasks...</div>}

        {/* Todos List */}
        {!loading && filteredTodos.length === 0 && (
          <div className="empty-state">
            <p>✨ No tasks here. Create one to get started!</p>
          </div>
        )}

        <div className="todos-container">
          {filteredTodos.map(todo => (
            <div key={todo.id} className={`todo-card ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-checkbox-section">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo)}
                  className="todo-checkbox"
                />
              </div>
              
              <div className="todo-content">
                <div className="todo-header">
                  <h3 className="todo-title">{todo.title}</h3>
                  <span className="priority-badge" style={{backgroundColor: getPriorityColor(todo.priority)}}>
                    {todo.priority}
                  </span>
                </div>
                {todo.description && <p className="todo-description">{todo.description}</p>}
                {todo.dueDate && <p className="todo-duedate">📅 Due: {new Date(todo.dueDate).toLocaleDateString()}</p>}
              </div>

              <div className="todo-actions">
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteTodo(todo.id)}
                  title="Delete task"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>🚀 Built with Node.js, React & Vite | DevOps Ready</p>
      </footer>
    </div>
  );
}
