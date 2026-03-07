const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = 3020;

// Middleware para entender JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado a la base de datos MongoDB');
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

// --- Rutas ---
const studentsRouter = require('./routes/students');
app.use('/students', studentsRouter);

const teachersRouter = require('./routes/teachers');
app.use('/teachers', teachersRouter);

const coursesRouter = require('./routes/courses');
app.use('/courses', coursesRouter);

const groupsRouter = require('./routes/groups');
app.use('/groups', groupsRouter);


app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
