const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Use 5000 as the port. 
// Using process.env.PORT allows us to configure it via Docker later.
const PORT = process.env.PORT || 5000;

// Enable CORS so our frontend can make requests to this backend
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Serve static files from the built frontend (production)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

// Simple in-memory storage for todos (persists during runtime)
let todos = [];
let nextId = 1;

// Initialize with sample todos
todos = [
  { id: 1, title: 'Learn Node.js', description: 'Master backend development with Express', completed: false, priority: 'high', dueDate: '2026-04-30' },
  { id: 2, title: 'Build React App', description: 'Create responsive frontend with Vite', completed: false, priority: 'high', dueDate: '2026-05-05' },
  { id: 3, title: 'Deploy with Docker', description: 'Containerize and deploy the application', completed: false, priority: 'medium', dueDate: '2026-05-15' }
];
nextId = 4;

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json({
    success: true,
    todos: todos,
    count: todos.length
  });
});

// GET single todo
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ success: false, message: 'Todo not found' });
  }
  res.json({ success: true, todo });
});

// CREATE new todo
app.post('/api/todos', (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  
  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }
  
  const newTodo = {
    id: nextId++,
    title,
    description: description || '',
    completed: false,
    priority: priority || 'medium',
    dueDate: dueDate || '',
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  res.status(201).json({ success: true, todo: newTodo });
});

// UPDATE todo
app.put('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ success: false, message: 'Todo not found' });
  }
  
  const { title, description, completed, priority, dueDate } = req.body;
  
  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (completed !== undefined) todo.completed = completed;
  if (priority !== undefined) todo.priority = priority;
  if (dueDate !== undefined) todo.dueDate = dueDate;
  
  res.json({ success: true, todo });
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Todo not found' });
  }
  
  const deleted = todos.splice(index, 1);
  res.json({ success: true, message: 'Todo deleted', todo: deleted[0] });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve index.html for all non-API routes (client-side routing for SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({ message: 'API is running. Frontend not found.' });
  }
});

// Listen on 0.0.0.0 to ensure it works properly inside a Docker container
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
  console.log(`📝 Todo API ready. Sample todos loaded.`);
});
