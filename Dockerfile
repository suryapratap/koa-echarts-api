FROM node:lts-buster-slim as node

RUN apt-get update \
    && apt-get install -qq build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

RUN npm i -g typescript

RUN groupadd echartskoa \
    && useradd -g echartskoa echartskoa \
    && mkdir -p /home/echartskoa /app /app/temp /app/www

RUN chown -R echartskoa:echartskoa /home/echartskoa \
    && chown -R echartskoa:echartskoa /app \
    && chown -R echartskoa:echartskoa /app/temp \
    && chown -R echartskoa:echartskoa /app/www

ENV PORT=80
WORKDIR /app
COPY --chown=echartskoa:echartskoa package*.json ./

USER echartskoa

RUN npm i && npm cache clean --force

COPY --chown=echartskoa:echartskoa . .

RUN tsc

EXPOSE ${PORT}
CMD ["node", "/app/www/index.js"]