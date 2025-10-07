# Multi-stage Dockerfile para matching-service
FROM maven:3.9.9-eclipse-temurin-17 AS builder

# Construir desde raíz de Backend
WORKDIR /backend
COPY . .

# Instalar shared y compilar matching-service
RUN mvn -q -DskipTests -pl shared -am install
RUN mvn -q -DskipTests -pl matching-service -am package

# Runtime stage
FROM eclipse-temurin:17-jre

# Establecer directorio de trabajo
WORKDIR /app

# Copiar JAR desde el stage de build
COPY --from=builder /backend/matching-service/target/matching-service-0.1.0-SNAPSHOT.jar app.jar

# Exponer puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]
