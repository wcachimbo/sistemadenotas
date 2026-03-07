const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// CREAR un nuevo curso
router.post('/', async (req, res) => {
  try {
    const course = new Course({
      name: req.body.name,
      description: req.body.description
    });
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// CONSULTAR todos los cursos
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
