FROM node:20.2.0-alpine

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .



# RUN echo  "VITE_VISIT_API_URL=${VISIT_SERVICE_HOST}" > .env
# RUN echo "VITE_USER_API_URL=${USER_SERVICE_HOST}" >> .env

EXPOSE 5173

CMD ["npm", "run", "docker"]