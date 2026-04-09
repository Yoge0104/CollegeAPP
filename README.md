# Smart College Companion App

A comprehensive college management application built with Spring Boot and React.

## Features

### 🔐 Authentication & User Management
- JWT-based authentication
- Role-based access control (Student, Faculty, Admin)
- User profiles with branch, year, and section

### 📅 Timetable Management
- View weekly class schedules
- Day-wise timetable view
- Faculty and room information

### 📚 Notes & Study Materials
- Upload and download study notes
- Filter by subject, topic, and semester
- Search functionality

### 💬 Doubt Hub / Discussion Forum
- Post and answer doubts
- Upvote system
- Mark doubts as resolved
- Subject-wise filtering

### 📢 Notices & Announcements
- Create and view notices
- Category-based organization (Exam, Academic, Placement, Event)
- Priority levels (Urgent, High, Medium, Low)

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- H2 Database (for development)
- Maven

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- Lucide React (icons)

## Project Structure

```
college-companion-app/
├── backend/
│   ├── src/main/java/com/collegecompanion/
│   │   ├── config/          # Security & CORS configuration
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── model/           # JPA Entities
│   │   ├── repository/      # Database repositories
│   │   ├── security/        # JWT utilities & filters
│   │   └── service/         # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── assets/styles/   # Global CSS
    │   ├── components/      # React components
    │   ├── context/         # Context API (Auth)
    │   ├── pages/           # Page components
    │   ├── services/        # API services
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher
- **MySQL 8.0 or higher** (running on localhost:3306)

### MySQL Database Setup

**IMPORTANT:** Before running the backend, set up the MySQL database:

1. Make sure MySQL is running on your machine
2. Run the setup script:
```bash
mysql -u root -p < backend/setup-database.sql
# Or use MySQL Workbench to execute the script
```

This will create a database named `LoginData`.

For detailed setup instructions, see [MYSQL-SETUP.md](MYSQL-SETUP.md)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies and run:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

**Note:** On first run, Spring Boot will automatically create all database tables!

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Database Configuration

### MySQL (Current Setup)
The application is configured to use MySQL database:
- **Database Name:** LoginData
- **URL:** jdbc:mysql://localhost:3306/LoginData
- **Username:** root
- **Password:** Yoge@8240

Configuration in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/LoginData?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
```

**Important Notes:**
- Tables are auto-created on first run by Spring Boot JPA
- `ddl-auto=update` preserves existing data and updates schema
- See [MYSQL-SETUP.md](MYSQL-SETUP.md) for detailed setup guide

### Switching to PostgreSQL

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/collegedb
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

Add PostgreSQL driver to `pom.xml`:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Timetable
- GET `/api/timetable` - Get timetable (with filters)
- POST `/api/timetable` - Create timetable entry
- PUT `/api/timetable/{id}` - Update entry
- DELETE `/api/timetable/{id}` - Delete entry

### Notes
- GET `/api/notes` - Get all notes (with filters)
- POST `/api/notes` - Upload note
- PUT `/api/notes/{id}` - Update note
- DELETE `/api/notes/{id}` - Delete note

### Doubts
- GET `/api/doubts` - Get all doubts (with filters)
- POST `/api/doubts` - Create doubt
- POST `/api/doubts/{id}/reply` - Add reply
- PUT `/api/doubts/{id}/upvote` - Upvote doubt
- PUT `/api/doubts/{id}/resolve` - Mark as resolved
- DELETE `/api/doubts/{id}` - Delete doubt

### Notices
- GET `/api/notices` - Get all notices (with filters)
- POST `/api/notices` - Create notice
- PUT `/api/notices/{id}` - Update notice
- DELETE `/api/notices/{id}` - Delete notice

## Features to Add (Future Enhancements)

- [ ] AI Summarization Module (using Python microservice)
- [ ] File upload for notes (PDF, DOCX)
- [ ] Email notifications
- [ ] Push notifications
- [ ] Admin analytics dashboard
- [ ] Attendance tracking
- [ ] Assignment submission
- [ ] Grade management
- [ ] Calendar integration
- [ ] Mobile app (React Native)

## Screenshots

(Add screenshots of your application here)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please contact the development team.

## Acknowledgments

- Spring Boot documentation
- React documentation
- Lucide React for icons
- Manrope & Montserrat fonts from Google Fonts
