const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = 3020;

// Middleware para entender JSON
app.use(express.json());

// Servir archivos estáticos desde el directorio 'frontend'
app.use(express.static(path.join(__dirname, '../frontend')));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a la base de datos MongoDB');
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

// --- Rutas ---
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const studentsRouter = require('./routes/students');
app.use('/students', studentsRouter);

const teachersRouter = require('./routes/teachers');
app.use('/teachers', teachersRouter);

const coursesRouter = require('./routes/courses');
app.use('/courses', coursesRouter);

const groupsRouter = require('./routes/groups');
app.use('/groups', groupsRouter);

const notesRouter = require('./routes/notes');
app.use('/notes', notesRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login/index.html'));
});

// Cualquier ruta no API vuelve al login como página inicial.
app.get(/^\/(?!auth|students|teachers|courses|groups|notes).*/, (req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
