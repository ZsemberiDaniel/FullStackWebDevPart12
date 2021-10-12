FROM node:16
USER node
WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci --only-production
RUN npm run tsc
RUN ls
RUN ls build
CMD ["npm", "start"]
