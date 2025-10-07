# Multi-stage Dockerfile para trips-service
FROM maven:3.9.9-eclipse-temurin-17 AS builder

# Trabajar desde la raíz de Backend para que Maven resuelva parent y módulos
WORKDIR /backend
COPY . .

# Instalar shared y compilar el servicio con dependencias necesarias
RUN mvn -q -DskipTests -pl shared -am install
RUN mvn -q -DskipTests -pl trips-service -am package

# Runtime stage
FROM eclipse-temurin:17-jre

# Establecer directorio de trabajo
WORKDIR /app

# Copiar JAR desde el stage de build
COPY --from=builder /backend/trips-service/target/trips-service-0.1.0-SNAPSHOT.jar app.jar

# Exponer puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]
