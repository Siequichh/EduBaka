# ── Etapa 1: Compilación ───────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copiar el wrapper + build.gradle primero para cachear dependencias
COPY gradle/ gradle/
COPY gradlew .
COPY build.gradle.kts settings.gradle.kts ./
RUN chmod +x gradlew

# Copiar el código fuente y empaquetar
COPY src ./src
RUN ./gradlew build -x test -q --no-daemon

# ── Etapa 2: Ejecución ──────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Usuario sin privilegios por seguridad
RUN addgroup -S edubaka && adduser -S edubaka -G edubaka
USER edubaka

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
