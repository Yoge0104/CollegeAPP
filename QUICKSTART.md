# 🚀 Quick Start Guide

Get your Smart College Companion App running in 5 minutes!

## ✅ Step 1: Install Prerequisites

Make sure you have:
- ☕ Java 17+ ([Download](https://www.oracle.com/java/technologies/downloads/))
- 📦 Maven 3.6+ ([Download](https://maven.apache.org/download.cgi))
- 🟢 Node.js 16+ ([Download](https://nodejs.org/))
- 🐬 MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))

## ✅ Step 2: Setup MySQL Database

### Open MySQL Command Line or MySQL Workbench

```sql
CREATE DATABASE IF NOT EXISTS LoginData 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

**Or** run the setup script:
```bash
mysql -u root -p < backend/setup-database.sql
```

## ✅ Step 3: Start Backend (Spring Boot)

```bash
# Navigate to backend folder
cd backend

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

✨ **Backend will be running on:** `http://localhost:8080`

⏰ **Wait for:** "Started CollegeCompanionApplication" message

## ✅ Step 4: Start Frontend (React)

**Open a new terminal window:**

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✨ **Frontend will be running on:** `http://localhost:3000`

## ✅ Step 5: Open Your Browser

Navigate to: **http://localhost:3000**

### First Time Setup:
1. Click "Register here"
2. Fill in your details:
   - Name: Your Name
   - Email: your@email.com
   - Password: Create a password
   - Role: Select "Student"
   - Branch: Select your branch (e.g., CSE)
   - Year: Select your year (e.g., 2)
   - Section: Select section (e.g., A)
3. Click "Create Account"
4. You'll be automatically logged in! 🎉

## 🎯 What You Can Do Now

### As a Student:
- 📅 View your timetable
- 📚 Browse and upload study notes
- 💬 Post doubts and help others
- 📢 Check important notices

### As Faculty/Admin:
- ➕ Create timetable entries
- 📝 Post notices and announcements
- 📖 Upload course materials
- 🎓 Help students with doubts

## 🔧 Troubleshooting

### Backend won't start?
- **Check:** Is MySQL running?
- **Check:** Did you create the LoginData database?
- **Check:** Is Java 17+ installed? (`java -version`)

### Frontend won't start?
- **Check:** Is Node.js installed? (`node -v`)
- **Run:** `npm install` in the frontend folder

### Can't connect to database?
- **Check:** MySQL is running on port 3306
- **Check:** Username and password in `application.properties`
- **Update:** If needed, edit `backend/src/main/resources/application.properties`

### Port already in use?
- **Backend (8080):** Change in `application.properties` → `server.port=8081`
- **Frontend (3000):** Change in `vite.config.js` → `port: 3001`

## 📱 Test Accounts

Create accounts with different roles to test features:

**Student Account:**
- Email: student@test.com
- Role: STUDENT
- Branch: CSE, Year: 2, Section: A

**Faculty Account:**
- Email: faculty@test.com
- Role: FACULTY

**Admin Account:**
- Email: admin@test.com
- Role: ADMIN

## 🎨 UI Preview

Your app features:
- 🌊 Modern blue and gold theme
- 📱 Fully responsive design
- ✨ Smooth animations
- 🎯 Intuitive navigation

## 📚 Next Steps

1. ✅ Create your first timetable entry
2. ✅ Upload some study notes
3. ✅ Post a question in Doubt Hub
4. ✅ Create an announcement

## 🆘 Need Help?

See the full documentation:
- [README.md](README.md) - Complete project overview
- [MYSQL-SETUP.md](MYSQL-SETUP.md) - Detailed database setup

## 🎉 You're All Set!

Happy learning with Smart College Companion! 🎓
