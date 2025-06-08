const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// הרשמה
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'יש למלא אימייל וסיסמה' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'משתמש כבר קיים' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    await user.save();
    res.status(201).json({ message: 'נרשמת בהצלחה' });
  } catch (err) {
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

// התחברות
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'אימייל או סיסמה שגויים' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'אימייל או סיסמה שגויים' });
    const token = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    // include user's courses so frontend can display them after login
    res.json({ token, user: { email: user.email, isAdmin: user.isAdmin, courses: user.courses } });
  } catch (err) {
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

// יצירת אדמין ראשוני (פעם אחת בלבד)
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'משתמש כבר קיים' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash, isAdmin: true });
    await user.save();
    res.status(201).json({ message: 'אדמין נוצר בהצלחה' });
  } catch (err) {
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

module.exports = router; 