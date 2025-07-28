# Fit Web Application

## Overview
The Fit Web Application is a Spring Boot-based web application that provides user authentication, JWT-based token management, and secure password storage using Bcrypt. It is designed to be a secure and scalable solution for managing user access and authentication.

## Features
- User registration and login
- JWT-based authentication and authorization
- Secure password hashing with Bcrypt
- Role-based access control

## Prerequisites
- Java 17 or higher
- Maven 3.8.1 or higher
- A database (e.g., MySQL, PostgreSQL) configured in `application.properties`

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fit
   ```

2. Configure the application properties:
   Update the `src/main/resources/application.properties` file with your database credentials and JWT secret:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/fit
   spring.datasource.username=<your-username>
   spring.datasource.password=<your-password>
   jwt.secret=<your-secret-key>
   jwt.expiration=3600000
   ```

3. Build the application:
   ```bash
   ./mvnw clean install
   ```

4. Run the application:
   ```bash
   java -jar target/fit-0.0.1-SNAPSHOT.jar
   ```

5. Access the application:
   The application will be available at `https://localhost:8443` (or the port specified in `application.properties`).

## API Endpoints

### Authentication
- **POST** `/api/v1/auth/register`
  - Request Body:
    ```json
    {
      "name": "JohnDoe",
      "email": "johndoe@example.com",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "token": "<jwt-token>",
      "expiresIn": "86400"
    }
    ```

- **POST** `/api/v1/auth/login`
  - Request Body:
    ```json
    {
      "email": "johndoe@example.com",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "token": "<jwt-token>",
      "expiresIn": "86400"
    }
    ```

## Testing
To run the tests, use the following command:
```bash
./mvnw test
```
Ensure that the test database is properly configured in `src/test/resources/application.properties`.

## Deployment
For production deployment, consider the following:
- Use a production-ready database (e.g., PostgreSQL, MySQL).
- Configure environment variables for sensitive data like `jwt.secret` and database credentials.
- Use a reverse proxy like Nginx for SSL termination.
- Optionally, containerize the application using Docker.

## Troubleshooting

### Port Conflict
If the default port `8443` is in use, update the `server.port` property in `application.properties`:
```properties
server.port=8081
```

### Common Issues
- **Database Connection Error**: Ensure the database is running and the credentials in `application.properties` are correct.
- **JWT Token Issues**: Verify the `jwt.secret` and `jwt.expiration` values in `application.properties`.
