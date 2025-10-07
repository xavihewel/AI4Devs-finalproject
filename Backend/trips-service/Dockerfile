# Multi-stage Dockerfile para trips-service
FROM maven:3.9-openjdk-17-slim AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de Maven
COPY pom.xml .
COPY ../pom.xml ../pom.xml
COPY ../shared/pom.xml ../shared/pom.xml

# Descargar dependencias (cache layer)
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Compilar la aplicación
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jre-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar JAR desde el stage de build
COPY --from=builder /app/target/trips-service-0.1.0-SNAPSHOT.jar app.jar

# Exponer puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]
