FROM node:18-alpine

ARG TARGET

WORKDIR /app

COPY . .
RUN npm install


# Conditionally copy .env.et1 to .env.production
RUN if [ "$TARGET" = "et1" ]; then \
    cp .env.et1 .env.production; \
    fi

# Conditionally copy .env.et2 to .env.production
RUN if [ "$TARGET" = "et2" ]; then \
    cp .env.et2 .env.production; \
    fi

# Compile website. This will create a production build in the /dist folder 
# VITE will replace all environment variables with the values from the .env.production file
RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "preview" ]
