# =============================================
# Stage 1: Build with Maven
# =============================================
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy only pom.xml first — leverage Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn package -DskipTests -B

# =============================================
# Stage 2: Run with slim JRE
# =============================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]