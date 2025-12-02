# 🏋️ Fitness Tracker Web App — MERN Stack

Fitness Tracker is a full-stack MERN web application that helps users track workouts, nutrition, calories, water intake, and progress — all in one clean and interactive dashboard.

🌐 **Live Site:** https://fitnesstracker-frontend-lgz6.onrender.com  

---

## ✨ Features

### 🔐 Authentication
- User Signup & Login (JWT)
- Email verification on signup
- Forgot Password + Reset Link (Nodemailer + Brevo)
- Secure password hashing using bcrypt

---

## 🏋️ Workouts Module
- Add workouts with:
  - Type  
  - Duration  
  - Date  
- Automatic **calorie burn calculation** using MET values
- Edit & delete workouts
- Workout history with filters
- Daily & total calorie burned tracking
- **Workout streak system** with sound + reward modal

---

## 🥗 Nutrition Tracking *(New!)*
- Search foods using **Spoonacular API**
- Fetch:
  - Calories  
  - Protein / Carbs / Fat  
  - Serving size + accurate units  
- Add meals to Breakfast, Lunch, Dinner, Snacks
- Daily calorie consumed tracking
- Macro indicators & meal cards
- Backend validation of units

---

## 💧 Water Intake Tracking *(New!)*
- Add glasses or mL of water
- Stored in a **separate MongoDB model**
- Daily water progress bar
- Quick-add UI buttons

---

## 📊 Data Visualization
- **7-day calorie burned vs consumed line chart**
- **Monthly calorie comparison bar chart**
- Pie chart for daily macros
- Progress stats for:
  - Workouts  
  - Nutrition  
  - Water  
  - Streak consistency  

---

## 🧭 Dashboard
- Today's calories burned & consumed
- Total water intake
- Workout streak count
- Quick-action buttons
- Dark/Light mode support (Chakra UI)
- Fully responsive layout

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Chakra UI
- Axios
- React Router DOM
- Recharts
- use-sound

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- Nodemailer + Brevo
- Spoonacular API
- JWT Authentication
- bcrypt
- CORS, dotenv, validator

---

## 📸 Screenshots

![alt text](<Screenshot 2025-12-02 at 12.47.05.png>)
![alt text](<Screenshot 2025-12-02 at 12.47.05-1.png>)
![alt text](<Screenshot 2025-12-02 at 12.47.05-2.png>)
![alt text](<Screenshot 2025-12-02 at 12.47.05-3.png>)


---

## 🔮 Future Enhancements

- AI-powered workout plans
- AI diet suggestions
- Push notifications
- Before/after progress photos
- Premium plan + payment integration


---

## 🙏 Acknowledgments
Built with ❤️ by Aasha Pun
Guidance & code review supported by OpenAI’s ChatGPT 🚀



