FROM node:18-alpine

WORKDIR /app

# copy content
COPY . .

# install frontend dependencies
RUN cd frontend && npm ci --legacy-peer-deps

# build frontend
RUN cd frontend && npm run build

# move build to backend
RUN cd frontend && mv ./build/ ../backend/

# install backend dependecies
RUN cd backend && npm ci

# start backend
CMD node ./backend/src/index.js
