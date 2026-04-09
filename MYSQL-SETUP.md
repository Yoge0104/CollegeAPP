# MySQL Database Setup Guide

## Prerequisites
- MySQL Server 8.0 or higher installed
- MySQL running on localhost:3306

## Step 1: Create the Database

### Option A: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Open the `setup-database.sql` file
4. Click Execute (⚡ icon)

### Option B: Using MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p
# Enter password: Yoge@8240

# Run the setup script
source /path/to/setup-database.sql

# Or create manually:
CREATE DATABASE IF NOT EXISTS LoginData 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

## Step 2: Verify Database Configuration

The application.properties is already configured with:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/LoginData?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=Yoge@8240
```

## Step 3: Run the Application

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**First time startup:** Spring Boot will automatically create all tables in the `LoginData` database!

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Database Tables

The following tables will be auto-created:

### 1. users
- id (PRIMARY KEY)
- name
- email (UNIQUE)
- password (encrypted)
- role (STUDENT/FACULTY/ADMIN)
- branch
- year
- section
- profile_image
- created_at

### 2. timetable
- id (PRIMARY KEY)
- day_of_week
- subject
- start_time
- end_time
- faculty
- room
- branch
- year
- section
- created_at

### 3. notes
- id (PRIMARY KEY)
- title
- description
- subject
- topic
- semester
- file_url
- file_name
- uploaded_by
- uploader_name
- created_at

### 4. doubts
- id (PRIMARY KEY)
- title
- description
- subject
- tags
- posted_by
- poster_name
- upvotes
- resolved
- created_at

### 5. doubt_replies
- id (PRIMARY KEY)
- doubt_id (FOREIGN KEY)
- content
- replied_by
- replier_name
- created_at

### 6. notices
- id (PRIMARY KEY)
- title
- content
- category (EXAM/ACADEMIC/PLACEMENT/EVENT/GENERAL)
- priority (LOW/MEDIUM/HIGH/URGENT)
- posted_by
- poster_name
- created_at

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
- Check your MySQL password
- Update password in `application.properties`

### Error: "Unknown database 'LoginData'"
- Make sure you ran the setup-database.sql script
- Or manually create the database

### Error: "Communications link failure"
- Ensure MySQL server is running
- Check if MySQL is running on port 3306
- Verify localhost connection

### Check if MySQL is running:
```bash
# Windows
services.msc (look for MySQL)

# Mac
brew services list

# Linux
sudo systemctl status mysql
```

### View created tables:
```sql
USE LoginData;
SHOW TABLES;
DESCRIBE users;
```

## Important Notes

⚠️ **ddl-auto=update**: 
- Tables are auto-created on first run
- Existing data is preserved
- Schema changes are applied automatically

🔒 **Security Reminder**:
- Change the default password before deployment
- Never commit passwords to version control
- Use environment variables in production

## Sample Test Data

Once the app is running, you can register users through the UI or insert test data:

```sql
-- Insert a test admin user (password: admin123 - bcrypt encrypted)
INSERT INTO users (name, email, password, role, created_at) 
VALUES ('Admin User', 'admin@college.edu', 
'$2a$10$YourBcryptHashHere', 'ADMIN', NOW());

-- Insert a test student
INSERT INTO users (name, email, password, role, branch, year, section, created_at) 
VALUES ('Test Student', 'student@college.edu', 
'$2a$10$YourBcryptHashHere', 'STUDENT', 'CSE', 2, 'A', NOW());
```

Note: Passwords are bcrypt encrypted. Use the register endpoint to create users properly.

## Next Steps

1. ✅ Database created
2. ✅ Application running
3. 🌐 Open browser: http://localhost:3000
4. 📝 Register your first account
5. 🎉 Start using the app!

## Production Deployment

For production, update these settings:

```properties
# Use environment variables
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# Change to 'validate' or 'none' in production
spring.jpa.hibernate.ddl-auto=validate

# Disable SQL logging
spring.jpa.show-sql=false
logging.level.com.collegecompanion=INFO
```
