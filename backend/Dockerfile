# ==========================================
# MLRIT Unified College Portal - Backend Dockerfile
# Multi-stage build for Spring Boot & Java 25
# ==========================================

# 1. Build Stage
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Copy maven wrapper and project descriptor
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn
RUN chmod +x ./mvnw

# Copy source code
COPY src ./src

# Build production jar
RUN ./mvnw clean package -DskipTests

# 2. Production Runtime Stage
FROM eclipse-temurin:25-jre
WORKDIR /app

# Copy compiled jar
COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
