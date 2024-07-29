FROM node:14:alpine
WORKDIR /app
COPY . .
RUN npm install rollup @rollup/plugin-html @rollup/plugin-node-resolve
RUN npx rollup -c
CMD ["node", "dist/bundle.js"]