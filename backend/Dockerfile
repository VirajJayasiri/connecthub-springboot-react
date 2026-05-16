# ── Stage 1: Build the Spring Boot JAR ─────────────────────────────
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache dependencies (faster rebuilds when only code changes)
COPY pom.xml .
RUN mvn -q -B dependency:go-offline -DskipTests

COPY src ./src
RUN mvn -q -B package -DskipTests

# ── Stage 2: Run the app (smaller image, no Maven inside) ───────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
