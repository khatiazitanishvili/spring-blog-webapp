# Spring Blog Web Application

A full-stack blog web application built with Spring Boot backend and React frontend, featuring comprehensive blog management, user authentication, and modern UI components.

---

## 🚀 Project Overview

This is a modern blogging platform that consists of three main components:

- **Backend (`fit/`)**: Spring Boot REST API with JWT authentication and comprehensive blog functionality
- **Frontend (`fit-frontend/`)**: React TypeScript SPA with responsive design and rich text editing
- **Database**: PostgreSQL with Adminer for database management

The application follows a monorepo structure and can be deployed using Docker Compose for both development and production environments.

---

## ✨ Features

### 📝 Blog Management
- **Posts**: Create, edit, publish, and draft blog posts with rich text editor
- **Categories**: Organize posts with hierarchical categories
- **Tags**: Tag posts for better discoverability
- **Comments**: Interactive comment system for post engagement
- **Media**: Image upload and management for post content

### 🔐 Authentication & Security
- JWT-based authentication and authorization
- User registration and login system
- Protected routes and session management
- Role-based access control
- Secure password hashing with BCrypt
- CORS configuration for cross-origin requests

### 🎨 User Experience
- Modern, responsive UI with Tailwind CSS and NextUI
- Mobile-friendly design with seamless navigation
- Rich text editor powered by TipTap
- Real-time form validation
- Loading states and error handling
- Smooth animations with Framer Motion

---

## 🛠️ Technology Stack

### Backend
- **Java 21** - Modern Java features and performance
- **Spring Boot 3.4.5** - Enterprise-grade framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database operations with Hibernate
- **JWT** - Stateless token-based authentication
- **PostgreSQL** - Robust relational database
- **H2** - In-memory database for development
- **MapStruct 1.6.3** - Type-safe object mapping
- **Lombok** - Reduced boilerplate code
- **Maven** - Dependency management and build automation

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type safety and enhanced development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **NextUI** - Beautiful React component library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication
- **TipTap** - Extensible rich text editor
- **Framer Motion** - Production-ready motion library
- **Lucide React** - Beautiful icon library

### DevOps & Deployment
- **Docker & Docker Compose** - Containerization and orchestration
- **PostgreSQL** - Production database
- **Adminer** - Database administration interface
- **HTTPS/SSL** - Secure communication

---

## 📋 Prerequisites

Ensure you have the following installed on your system:

- **Java 21** or higher
- **Node.js 18** or higher  
- **npm 9** or higher
- **Maven 3.8.1** or higher
- **Docker** and **Docker Compose**
- **Git** for version control

---

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd spring-blog-webapp
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_NAME=blogdb
   DB_USERNAME=bloguser
   DB_PASSWORD=blogpass123
   
   # Frontend Configuration
   VITE_API_URL=https://localhost:8443/api/v1
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - **Frontend**: https://localhost:5173
   - **Backend API**: https://localhost:8443/api/v1
   - **Database Admin**: http://localhost:8888

### Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd fit
   ```

2. **Configure application properties**
   Update `src/main/resources/application.properties`:
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:postgresql://localhost:5432/blogdb
   spring.datasource.username=bloguser
   spring.datasource.password=blogpass123
   
   # JWT Configuration
   jwt.secret=your-secret-key-here
   jwt.expiration=86400000
   
   # Server Configuration
   server.port=8443
   server.ssl.enabled=true
   ```

3. **Start PostgreSQL database**
   ```bash
   docker-compose up -d db
   ```

4. **Build and run the Spring Boot application**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd fit-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```
spring-blog-webapp/
├── docker-compose.yml           # Main orchestration file
├── .env                        # Environment variables
├── README.md                   # Project documentation
│
├── fit/                        # Spring Boot Backend
│   ├── src/main/java/com/blog/fit/
│   │   ├── config/            # Configuration classes
│   │   ├── controllers/       # REST API endpoints
│   │   ├── domain/
│   │   │   ├── entities/      # JPA entities
│   │   │   └── dtos/          # Data transfer objects
│   │   ├── mappers/           # MapStruct mappers
│   │   ├── repositories/      # Data access layer
│   │   ├── security/          # Security configuration
│   │   └── services/          # Business logic layer
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── static/post-photos/ # Uploaded images
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── pom.xml                # Maven dependencies
│
└── fit-frontend/              # React Frontend
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/            # Route components
    │   ├── services/         # API service layer
    │   ├── hooks/            # Custom React hooks
    │   └── assets/           # Static assets
    ├── public/               # Public assets
    ├── Dockerfile
    ├── package.json          # NPM dependencies
    ├── vite.config.ts        # Vite configuration
    └── tailwind.config.js    # Tailwind CSS config
```

---

## 🔌 API Endpoints

### Authentication
- **POST** `/api/v1/auth/register` - User registration
- **POST** `/api/v1/auth/login` - User login

### Posts
- **GET** `/api/v1/posts` - Get all published posts (with optional category/tag filters)
- **GET** `/api/v1/posts/drafts` - Get user's draft posts (authenticated)
- **GET** `/api/v1/posts/{id}` - Get post by ID
- **POST** `/api/v1/posts` - Create new post (authenticated)
- **PUT** `/api/v1/posts/{id}` - Update post (authenticated)
- **DELETE** `/api/v1/posts/{id}` - Delete post (authenticated)

### Categories
- **GET** `/api/v1/categories` - Get all categories
- **POST** `/api/v1/categories` - Create category (authenticated)
- **PUT** `/api/v1/categories/{id}` - Update category (authenticated)
- **DELETE** `/api/v1/categories/{id}` - Delete category (authenticated)

### Tags
- **GET** `/api/v1/tags` - Get all tags
- **GET** `/api/v1/tags/{id}` - Get tag by ID
- **POST** `/api/v1/tags` - Create tag (authenticated)
- **PUT** `/api/v1/tags/{id}` - Update tag (authenticated)
- **DELETE** `/api/v1/tags/{id}` - Delete tag (authenticated)

### Comments
- **GET** `/api/v1/comments` - Get all comments
- **GET** `/api/v1/comments/post/{postId}` - Get comments for a post
- **GET** `/api/v1/comments/user/{userId}` - Get comments by user
- **POST** `/api/v1/comments/post/{postId}` - Create comment (authenticated)
- **PUT** `/api/v1/comments/{id}` - Update comment (authenticated)
- **DELETE** `/api/v1/comments/{id}` - Delete comment (authenticated)

---

## ⚙️ Configuration

### Environment Variables

#### Database
- `DB_NAME` - Database name (default: blogdb)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

#### Backend
- `JWT_SECRET` - Secret key for JWT token signing
- `JWT_EXPIRATION` - Token expiration time in milliseconds
- `SERVER_PORT` - Server port (default: 8443)

#### Frontend
- `VITE_API_URL` - Backend API base URL

### Database Configuration

The application supports multiple database configurations:

**PostgreSQL (Production)**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/blogdb
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

**H2 (Development)**
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

---

## 🧪 Testing

### Backend Tests
```bash
cd fit
./mvnw test
```

### Frontend Tests
```bash
cd fit-frontend
npm test
```

### Integration Tests
```bash
docker-compose up -d
# Run your integration test suite
```

---

## 🚀 Deployment

### Production Deployment

1. **Build production images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Deploy to production**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Environment-Specific Configurations

Create environment-specific configuration files:
- `.env.development` - Development environment
- `.env.staging` - Staging environment  
- `.env.production` - Production environment

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
- Ensure PostgreSQL is running and accessible
- Verify database credentials in configuration
- Check network connectivity between containers

**Frontend Build Issues**
- Clear node_modules and reinstall: `npm run clean && npm install`
- Verify Node.js version compatibility
- Check for TypeScript compilation errors

**SSL Certificate Issues**
- Generate new SSL certificates for local development
- Verify certificate paths in configuration
- Check browser security settings

### Development Tips

- Use `docker-compose logs <service-name>` to debug service issues
- Enable debug logging in Spring Boot: `logging.level.com.blog.fit=DEBUG`
- Use browser developer tools for frontend debugging
- Check Adminer (localhost:8888) for database inspection

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow Java coding standards and Spring Boot best practices
- Use TypeScript for all frontend code
- Write comprehensive tests for new features
- Update documentation for API changes
- Follow conventional commit message format

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Spring Boot community for excellent documentation
- React and TypeScript teams for modern web development tools
- NextUI for beautiful component library
- TipTap for rich text editing capabilities

---

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check existing documentation and troubleshooting guide
- Review the API documentation for endpoint usage