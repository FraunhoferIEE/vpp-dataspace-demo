# First stage: Build jar
FROM openjdk:17-slim-buster AS builder

WORKDIR /app

COPY . .

RUN ./gradlew clean launchers:der-connector:build

FROM openjdk:17-slim-buster

RUN apt update \
  && apt install -y curl \
  && apt install -y inetutils-ping \
  && apt install -y jq \
  && rm -rf /var/cache/apt/archives /var/lib/apt/lists

WORKDIR /app
COPY --from=builder /app/launchers/der-connector/build/libs/connector.jar /app/connector.jar
HEALTHCHECK --interval=5s --timeout=5s --retries=10 CMD curl --fail http://localhost:8181/api/check/health

ENTRYPOINT [ "sh", "-c", "exec java -jar connector.jar"]
