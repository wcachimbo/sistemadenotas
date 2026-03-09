const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Group = require('../models/Group'); // Necesitamos el modelo de Grupo

// CREAR un nuevo profesor
router.post('/', async (req, res) => {
  try {
    const {
      identification,
      typeIdentification,
      name,
      lastname,
      professorship,
      user,
      password,
      status
    } = req.body;

    if (!identification || !typeIdentification || !name || !lastname || !professorship || !user || !password) {
      return res.status(400).json({
        message: 'Faltan campos requeridos: identification, typeIdentification, name, lastname, professorship, user, password'
      });
    }

    const teacher = new Teacher({
      identification,
      typeIdentification,
      name,
      lastname,
      professorship,
      user,
      password,
      status: typeof status === 'boolean' ? status : true
    });

    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'identification o user ya existe' });
    }
    res.status(400).json({ message: err.message });
  }
});

// CONSULTAR todos los profesores
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CONSULTAR los grupos (y sus cursos) de un profesor específico
router.get('/:teacherId/groups', async (req, res) => {
  try {
    const groups = await Group.find({ teacher: req.params.teacherId }).populate('course');
    if (!groups) {
        return res.status(400).json({ message: 'No se encontraron grupos para este profesor' });
    }
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
