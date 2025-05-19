const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

// Middleware לבדוק הרשאת אדמין
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'לא מחובר' });
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    if (!decoded.isAdmin) return res.status(403).json({ message: 'אין הרשאה' });
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'טוקן לא תקין' });
  }
}

// כל הקורסים
router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// הוספת קורס (אדמין בלבד)
router.post('/', requireAdmin, async (req, res) => {
  const { name, price, description, image } = req.body;
  if (!name || !price) return res.status(400).json({ message: 'שם ומחיר חובה' });
  const course = new Course({ name, price, description, image });
  await course.save();
  res.status(201).json(course);
});

// מחיקת קורס (אדמין בלבד)
router.delete('/:id', requireAdmin, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: 'קורס נמחק' });
});

module.exports = router; 