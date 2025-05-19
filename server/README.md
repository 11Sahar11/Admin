# שרת מכללת AI – הרשאות וניהול קורסים

## התקנה והרצה

1. התקן את התלויות:
   ```
   npm install
   ```
2. צור קובץ `.env` בתיקיית `server/` עם:
   ```
   MONGO_URI=mongodb://localhost:27017/ai_college
   JWT_SECRET=your_jwt_secret_here
   PORT=4000
   ```
3. הפעל את השרת:
   ```
   npm run dev
   ```

## מסלולי API עיקריים
- `POST /api/auth/register` – הרשמה
- `POST /api/auth/login` – התחברות (מחזיר JWT)
- `POST /api/auth/create-admin` – יצירת אדמין ראשוני
- `GET /api/courses` – צפייה בכל הקורסים
- `POST /api/courses` – הוספת קורס (אדמין בלבד)
- `DELETE /api/courses/:id` – מחיקת קורס (אדמין בלבד)

## הערות
- יש להפעיל MongoDB לוקאלית או להשתמש ב-MongoDB Atlas (cloud)
- יש להגדיר סוד JWT חזק בקובץ הסביבה
- ניתן להרחיב את המערכת בקלות למשתמשים, רכישות, ועוד 