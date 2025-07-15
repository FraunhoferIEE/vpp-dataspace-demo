# First stage: Build jar
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

COPY . .

RUN ./gradlew clean launchers:et-connector:build

FROM eclipse-temurin:17-jdk-alpine

RUN apk add --no-cache curl iputils jq

WORKDIR /app
COPY --from=builder /app/launchers/et-connector/build/libs/connector.jar /app/connector.jar
HEALTHCHECK --interval=5s --timeout=5s --retries=10 CMD curl --fail http://localhost:8181/api/check/health

ENTRYPOINT [ "sh", "-c", "exec java -jar connector.jar"]
