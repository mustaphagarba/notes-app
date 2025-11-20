// app.js
const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// In-memory storage (for simplicity - replace with database for production)
let notes = [
  { id: 1, title: 'Welcome', content: 'Welcome to your notes app! Click edit to modify this note.' }
];
let nextId = 2;

// Routes
app.get('/', (req, res) => {
  res.render('index', { notes });
});

app.get('/note/:id', (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) return res.status(404).send('Note not found');
  res.render('view', { note });
});

app.get('/edit/:id', (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) return res.status(404).send('Note not found');
  res.render('edit', { note });
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/save', (req, res) => {
  const { id, title, content } = req.body;
  if (id) {
    const note = notes.find(n => n.id === parseInt(id));
    if (note) {
      note.title = title;
      note.content = content;
    }
  } else {
    notes.push({ id: nextId++, title, content });
  }
  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  notes = notes.filter(n => n.id !== parseInt(req.params.id));
  res.redirect('/');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Notes app listening on port ${PORT}`);
});