const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// --- Rutas para Estudiantes ---

// CREAR un nuevo estudiante
router.post('/', async (req, res) => {
  try {
    // El campo "course" ya no existe, un estudiante se crea "vacío"
    // y luego se inscribe en grupos.
    const student = new Student({
      name: req.body.name
    });
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// CONSULTAR todos los estudiantes
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CONSULTAR los grupos de un estudiante específico
router.get('/:studentId/groups', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .populate({
        path: 'groups',
        populate: [ // Populado anidado
          { path: 'course' },
          { path: 'teacher' }
        ]
      });

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.json(student.groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
