ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine
COPY . /app
WORKDIR /app
RUN sh -c "corepack enable && (yarn install --immutable || yarn install --frozen-lockfile)"
EXPOSE 3000
CMD yarn start

