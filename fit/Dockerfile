# Use a lightweight OpenJDK base image
FROM eclipse-temurin:21-jdk-alpine

# Set the working directory
WORKDIR /app

# Copy the Spring Boot jar to the container
COPY target/fit-0.0.1-SNAPSHOT.jar app.jar

# Expose port (usually 8080)
EXPOSE 8443

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]



# What if I am using a compose.yml for postgresSQL db, how can I build my API docker?
