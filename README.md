# Spring Blog Web Application

A full-stack blog web application built with Spring Boot backend and React frontend, featuring user authentication, blog post management, and secure content delivery.

## 🚀 Project Overview

This application consists of two main components:
- **Backend (`fit/`)**: Spring Boot REST API with JWT authentication
- **Frontend (`fit-frontend/`)**: React TypeScript application with modern UI

## ✨ Features

### Backend Features
- 🔐 JWT-based authentication and authorization
- 👥 User registration and login system
- 📝 Blog post CRUD operations
- 🏷️ Category and tag management
- 💬 Comment system
- 🔒 Role-based access control
- 📁 File upload for post photos
- 🗄️ PostgreSQL/H2 database support
- 🔑 Secure password hashing with BCrypt

### Frontend Features
- 🎨 Modern, responsive UI with Tailwind CSS and NextUI
- 🔐 Protected routes and session management
- 📱 Mobile-friendly design
- ✍️ Rich text editor for blog posts
- 🖼️ Image upload and management
- 🔍 Blog browsing and search functionality
- 👤 User profile management
- 💬 Comment interaction

## 🛠️ Technology Stack

### Backend
- **Java 21**
- **Spring Boot 3.4.5**
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database operations
- **JWT** - Token-based authentication
- **PostgreSQL** - Production database
- **H2** - Development database
- **MapStruct** - Object mapping
- **Lombok** - Boilerplate code reduction
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling framework
- **NextUI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **TipTap** - Rich text editor
- **Framer Motion** - Animations

## 📋 Prerequisites

- **Java 21** or higher
- **Node.js 18** or higher
- **Maven 3.8.1** or higher
- **npm 9** or higher
- **PostgreSQL** (for production) or H2 (for development)

## 🚀 Getting Started

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd fit
   ```

2. **Configure database (optional for development):**
   - For H2 (default): No additional setup required
   - For PostgreSQL: Update `src/main/resources/application.properties`

3. **Start PostgreSQL with Docker (optional):**
   ```bash
   docker-compose up -d
   ```

4. **Run the Spring Boot application:**
   ```bash
   ./mvnw spring-boot:run
   ```
   Or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

5. **Access the application:**
   - API: `http://localhost:8080`
   - Database Admin (Adminer): `http://localhost:8888` (if using Docker)

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd fit-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the frontend:**
   - Application: `http://localhost:5173`

## 🏗️ Project Structure

```
spring-blog-webapp/
├── fit/                          # Spring Boot Backend
│   ├── src/main/java/com/blog/fit/
│   │   ├── config/              # Configuration classes
│   │   ├── controllers/         # REST controllers
│   │   ├── domain/              # Entity classes
│   │   ├── mappers/             # MapStruct mappers
│   │   ├── repositories/        # JPA repositories
│   │   ├── security/            # Security configuration
│   │   └── services/            # Business logic
│   ├── src/main/resources/
│   │   ├── static/post-photos/  # Uploaded images
│   │   └── application.properties
│   ├── docker-compose.yml       # PostgreSQL setup
│   └── pom.xml                  # Maven dependencies
│
└── fit-frontend/                # React Frontend
    ├── src/
    │   ├── components/          # Reusable components
    │   ├── pages/               # Page components
    │   ├── services/            # API services
    │   ├── hooks/               # Custom React hooks
    │   └── assets/              # Static assets
    ├── public/                  # Public assets
    └── package.json             # npm dependencies
```

## 🔧 Configuration

### Backend Configuration

The main configuration file is `fit/src/main/resources/application.properties`. Key settings include:

- Database connection
- JWT secret and expiration
- File upload settings
- Server port configuration

### Frontend Configuration

Environment variables can be configured in `fit-frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Users register/login through the frontend
2. Backend validates credentials and returns a JWT token
3. Frontend stores the token and includes it in subsequent requests
4. Backend validates the token for protected endpoints

## 📝 API Documentation

### Main Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/posts` - Get all blog posts
- `POST /api/posts` - Create new blog post (authenticated)
- `PUT /api/posts/{id}` - Update blog post (authenticated)
- `DELETE /api/posts/{id}` - Delete blog post (authenticated)
- `GET /api/posts/{id}/comments` - Get post comments
- `POST /api/posts/{id}/comments` - Add comment (authenticated)

## 🐳 Docker Support

### Using Docker Compose (Development)

Start PostgreSQL and Adminer:
```bash
cd fit
docker-compose up -d
```

### Database Access
- **PostgreSQL**: `localhost:5432`
  - Database: `postgres`
  - Username: `postgres`
  - Password: `authpass`
- **Adminer**: `http://localhost:8888`

## 🧪 Testing

### Backend Tests
```bash
cd fit
./mvnw test
```

### Frontend Tests
```bash
cd fit-frontend
npm run test
```

## 📦 Building for Production

### Backend
```bash
cd fit
./mvnw clean package
java -jar target/fit-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd fit-frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

If you have any questions or need help getting started, please open an issue on GitHub.

## 🔗 Useful Links

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [JWT.io](https://jwt.io/) - JWT token debugger

---

Built with ❤️ using Spring Boot and React
