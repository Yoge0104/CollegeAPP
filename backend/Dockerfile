# Stage 1: Build the Spring Boot application (Maven)
# Uses a JDK image from Eclipse Temurin for compilation.
FROM eclipse-temurin:21-jdk-jammy AS builder

# Set the working directory inside the container for the build stage.
WORKDIR /app

# Copy Maven wrapper and config (if you use mvnw)
COPY mvnw .
COPY .mvn .mvn

# Copy the Maven project files
COPY pom.xml .

# Download dependencies (this will be cached as long as pom.xml does not change)
RUN ./mvnw dependency:go-offline -B || mvn dependency:go-offline -B

# Copy the source code
COPY src src

# Build the Spring Boot application into an executable JAR.
# -DskipTests skips tests to speed up the Docker build.
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Stage 2: Create the final, lightweight runtime image
# Uses a JRE image from Eclipse Temurin, smaller than full JDK.
FROM eclipse-temurin:21-jre-jammy

# Set the working directory inside the container for the runtime stage.
WORKDIR /app

# Copy the executable JAR from the builder stage to the final image.
# Adjust the jar name if your built jar has a different name.
COPY --from=builder /app/target/college-companion-0.0.1-SNAPSHOT.jar app.jar

# Expose the port on which your Spring Boot application listens.
# Based on your application.properties, this is 8080.
EXPOSE 8080

# Define the command to run your application when the container starts.
ENTRYPOINT ["java", "-jar", "app.jar"]
