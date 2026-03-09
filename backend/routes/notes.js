const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Crear una nueva nota
router.post('/', async (req, res) => {
  try {
    const newNote = new Note(req.body);
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener las notas de un estudiante
router.get('/student/:studentId', async (req, res) => {
  try {
    const notes = await Note.find({ student: req.params.studentId }).populate({
      path: 'group',
      populate: [
        { path: 'course', model: 'Course' },
        { path: 'teacher', model: 'Teacher' }
      ]
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar una nota
router.put('/:noteId', async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.noteId, req.body, { new: true });
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar una nota
router.delete('/:noteId', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.noteId);
    res.json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
