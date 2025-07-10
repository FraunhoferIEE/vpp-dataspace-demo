FROM node:18-alpine

ARG TARGET

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Conditionally copy .env.der1 to .env.production
RUN if [ "$TARGET" = "der1" ]; then \
    cp .env.der1 .env.production; \
    fi

# Compile website. This will create a production build in the /dist folder 
# VITE will replace all environment variables with the values from the .env.production file
RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "preview" ]
