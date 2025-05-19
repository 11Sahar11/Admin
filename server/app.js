require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');

const app = express();
app.use(cors());
app.use(express.json());

// חיבור למסד נתונים
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_college', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// בדיקת חיבור
mongoose.connection.on('connected', () => {
  console.log('MongoDB מחובר בהצלחה');
});

// ראוט בסיסי לבדיקה
app.get('/', (req, res) => {
  res.send('ברוך הבא לשרת מכללת AI!');
});

// TODO: להוסיף ראוטים להרשמה, התחברות, קורסים, הרשאות

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('השרת רץ על פורט', PORT);
}); 