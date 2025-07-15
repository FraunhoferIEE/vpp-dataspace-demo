# First stage: Build jar
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

COPY . .

RUN apk add --no-cache dos2unix \
  && dos2unix ./gradlew \
  && chmod +x ./gradlew \
  && ./gradlew clean launchers:der-connector:build

# Final stage
FROM eclipse-temurin:17-jdk-alpine

RUN apk add --no-cache curl iputils jq

WORKDIR /app
COPY --from=builder /app/launchers/der-connector/build/libs/connector.jar /app/connector.jar

HEALTHCHECK --interval=5s --timeout=5s --retries=10 CMD curl --fail http://localhost:8181/api/check/health

ENTRYPOINT [ "sh", "-c", "exec java -jar connector.jar" ]
