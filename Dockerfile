FROM node:22-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm 
COPY package.json  pnpm-lock.yaml* .npmrc ./

#Dev stage
FROM base AS dev
RUN pnpm config set minimum-release-age 0 && pnpm install --frozen-lockfile --ignore-scripts

COPY . .

CMD [ "pnpm", "run", "start:dev" ]


#build stage 

FROM  dev AS build

RUN pnpm run build
RUN  pnpm prune --prod


FROM base AS production 
COPY --from=build /app/dist ./dist/ 
COPY --from=build /app/node_modules ./node_modules/

CMD ["node","dist/main.ts"]Invalid email or password
