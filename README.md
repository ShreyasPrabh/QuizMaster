# QuizClub 🎯 (www.quizclub.in)

An interactive, full-stack quiz and learning platform built with **React (Vite)** and **Django REST Framework**.

---

## ✨ Features

- 📚 **6 Subject Domains**: Programming, Mathematics, Science, Computer Science, General Knowledge, and English.
- 📂 **60 Subtopics**: 10 comprehensive subtopics per domain.
- 🎯 **3 Difficulty Tiers**: Easy, Intermediate, and Hard (20 MCQs per quiz session).
- ⚡ **Interactive Quiz Session**: Dynamic timer, flag question, interactive answer grid, and instant evaluation.
- 📊 **Performance Analytics**: Real-time accuracy metrics, question history, and streak tracking.
- 🏆 **Global Leaderboard**: Live competitive ranking based on completed quizzes.
- 🎨 **Modern UI/UX**: Dark mode, glassmorphic cards, responsive navigation, and accessible layout.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **React Router v6**
- **Lucide Icons**
- **Vanilla Modern CSS** (Design Tokens & Glassmorphic Themes)

### Backend
- **Python & Django**
- **Django REST Framework**
- **SQLite / PostgreSQL**
- **JWT / Session Authentication**

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # On Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5174` in your browser.

---

## 📄 License
MIT
