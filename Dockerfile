FROM node:14:alpine
WORKDIR /app
COPY . .
RUN npm install rollup @rollup/plugin-html @rollup/plugin-node-resolve
RUN npx rollup -c rollup.config.mjs
CMD ["node", "dist/bundle.js"]