# 🏢 EmpAnalytics — AI-Based Employee Performance Analytics & Recommendation System

![Project Banner](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react)
![AI](https://img.shields.io/badge/AI-OpenRouter-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

> A full-stack web application that helps HR teams track, analyze, and improve employee performance using AI-powered recommendations powered by OpenRouter API.

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)

---

## 📖 About the Project

**EmpAnalytics** is an AI-powered HR dashboard that allows organizations to:

- Manage employee records with full CRUD operations
- Search and filter employees by department, name, and performance score
- Get AI-generated performance feedback and career recommendations for individual employees
- Run bulk AI analysis across the entire team to identify top performers and employees needing improvement
- View ranked employee leaderboards sorted by performance score
- Secure the system with JWT-based authentication for HR and Admin roles

The AI recommendations are powered by **OpenRouter API** (using the DeepSeek R1 free model), which analyzes each employee's profile and returns structured, actionable insights including promotion readiness, skill gaps, training suggestions, and career path guidance.

---

## ✨ Features

### 🔐 Authentication
- User Signup and Login with JWT token-based security
- Role-based access: `admin` and `hr`
- Protected routes — only logged-in users can access the dashboard

### 👥 Employee Management
- Add new employees with name, email, department, skills, performance score, and experience
- Dynamic skills input — type and press Enter to add skill tags
- Edit existing employee records
- Delete employees with confirmation
- View all employees in a clean, responsive table

### 🔍 Search & Filter
- Search employees by name (partial match supported)
- Filter by department
- Filter by minimum and maximum performance score range
- Real-time results update on search

### 🤖 AI Recommendations (OpenRouter)
- **Single Employee Analysis** — Select any employee and get a detailed AI report including:
  - Promotion recommendation (Yes/No with reasoning)
  - Training and course suggestions
  - Detailed performance feedback
  - 3-year career path suggestion
  - Skill gap analysis
- **Bulk Team Analysis** — Analyze all employees at once and get:
  - Overall team ranking with justification
  - Top 3 candidates for promotion
  - Employees who need an improvement plan
  - Department-wise performance summary

### 🏆 Rankings
- View all employees ranked by performance score (highest to lowest)
- Podium display for top 3 performers (Gold, Silver, Bronze)
- Performance category labels: Top Performer, Meets Expectations, Needs Improvement

### 📊 Dashboard
- Live statistics: total employees, average score, top performers count, departments count
- Quick actions panel
- Recent employees table

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose ODM |
| Authentication | JWT (JSON Web Tokens), bcryptjs |
| AI Integration | OpenRouter API (DeepSeek R1 Free) |
| Notifications | React Toastify |
| Deployment | Render (Backend), Render Static Site (Frontend) |

---

## 📁 Project Structure

```
employee-analytics/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Signup, Login, Profile
│   │   ├── employeeController.js  # CRUD + Search + Rankings
│   │   └── aiController.js        # OpenRouter AI integration
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js                # User schema (auth)
│   │   └── Employee.js            # Employee schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── aiRoutes.js
│   ├── server.js                  # Express app entry point
│   ├── package.json
│   └── .env.example               # Environment variable template
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   └── Navbar.js          # Navigation bar
│       ├── context/
│       │   └── AuthContext.js     # Global auth state
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Signup.js
│       │   ├── Dashboard.js
│       │   ├── EmployeeList.js    # List + Search + Delete
│       │   ├── AddEmployee.js     # Add form with skill tags
│       │   ├── EditEmployee.js    # Edit form
│       │   ├── AIRecommendations.js
│       │   └── Rankings.js
│       ├── utils/
│       │   └── api.js             # Axios API calls
│       ├── App.js                 # Routes + Auth guard
│       ├── App.css                # Global styles
│       └── index.js
│
├── README.md
├── render.yaml                    # Render deployment config
└── .gitignore
```

---


## 👨‍💻 Author

**Vidisha Goel**
- GitHub: [Vidisha21Goel](https://github.com/Vidisha21Goel)
- Email: vidisha21goel@gmail.com

---

## 📄 License

This project is licensed under the MIT License.

---

> Made with ❤️ using the MERN Stack and OpenRouter AI
