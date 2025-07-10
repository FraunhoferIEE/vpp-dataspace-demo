# DEA-App

## Local dev

```shell
# Adjust .env as needed
npm run dev
```

## Build image

```shell
docker buildx build --build-arg TARGET=dea1 --load -t hub.cc-asp.fraunhofer.de/vkee/dea1-app:latest .

docker push hub.cc-asp.fraunhofer.de/vkee/dea1-app:latest

```
